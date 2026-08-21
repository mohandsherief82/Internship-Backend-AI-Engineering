import fs from "node:fs/promises";

import config from "./config/env";

async function fetchHTML(target: string) {
    return await fetch(target, {
        method: "GET",
        signal: AbortSignal.timeout(config.timeout),
        headers: {
            "user-agent": config.userAgent
        }
    });
}

async function writeFetchedHTML(content: string, filePath: string) {
    if (!content) {
        throw new Error("Missing content to write");
    }

    try {
        await fs.writeFile(filePath, content, {
            encoding: "utf-8",
            flag: "w"
        });

        return true;
    } catch (err) {
        console.error("Error writing file:", err);

        return false
    }
}

async function readFromCache(filePath: string) : Promise<boolean> {
    try {
        const res = await fs.readFile(filePath, "utf-8");

        if (res.length != 0) {
            console.log("\nCACHE HIT");

            return true;
        }
    } catch (err: unknown) {
        if (typeof err === "object" && err !== null &&
            "code" in err && err.code === "ENOENT") {
            console.log(`File doesn't exist.\nFile will be created at \"${filePath}..\"`);
        } else {
            console.error("Failure reading file....", err);
        }
    }

    console.log(`File exists at path ${filePath}, but it is empty..`);
    console.log("\nFETCH");

    return false;
}

export async function fetcher(target: string) {
    try {
        const inCache = await readFromCache("./scrapper/cache/catalogue-page-1.html")

        if (!inCache) {
            const response = await fetchHTML(target);

            if (response.status === 200) {
                const htmlPage = await response.text();

                await writeFetchedHTML(htmlPage, "./scrapper/cache/catalogue-page-1.html");
            }
        }
    } catch (err) {
        console.error(err);
    }
} 
