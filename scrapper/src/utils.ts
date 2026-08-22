import fs from "node:fs/promises";
import fsd from "node:fs";
import path from "node:path";

import config from "./config/env";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

export async function fetcher(target: string, storagePath: string) {
    try {
        const inCache = await readFromCache("./scrapper/cache/" + storagePath)

        if (!inCache) {
            await sleep(500);
            const response = await fetchHTML(target);

            if (response.status === 200) {
                const htmlPage = await response.text();

                await writeFetchedHTML(htmlPage, "./scrapper/cache/" + storagePath);
            }
        }
    } catch (err) {
        console.error(err);
    }
} 

export function getFetchDate(filePath: string): Date | null {
    const absolutePath = resolveCachePath(filePath);

  if (fsd.existsSync(absolutePath)) {
    const stats = fsd.statSync(absolutePath);
        
    return stats.mtime;
  }

  return null;
}

function resolveCachePath(relativePath: string): string {
  return path.resolve(process.cwd(), "scrapper", "cache", relativePath);
}

export function slugToTitle(slug: string): string {
  return slug
    .replace(/_\d+$/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
