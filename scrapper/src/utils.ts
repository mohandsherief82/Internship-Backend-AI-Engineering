import fs from "node:fs/promises";
import { file } from "zod";

interface inMemory { 
    inCache: boolean;
    htmlPage: string;
}

async function writeFetchedHTML(content: string, filePath: string) {
    try {
        await fs.writeFile(filePath, content);

        return true;
    } catch (err) {
        console.error("Error writing file:", err);

        return false;
    }
}

export async function readFromCache(filePath: string) : Promise<inMemory> {
    try {
        const res = await fs.readFile(filePath, "utf-8");

        if (res.length != 0) {
            return {inCache: true, htmlPage: res};
        }
    } catch (err) {
        console.error("Failure reading file", err);
    }

    return {inCache: false, htmlPage: ""};
}

export async function parseData(htmlContent: string, inCache: boolean) {
    if (inCache) {
        console.log("CACHE HIT");

        return true;
    }

    console.log("FETCH");
    
    if (!htmlContent) {
        throw new Error("Failed to fetch data");
    }

    console.log("Fetched page successfully.");

    const writeState = await writeFetchedHTML(htmlContent, "./scrapper/cache/catalogue-page-1.html");

    if (!writeState) {
        console.log("Problems writing to file.");

        return false;
    }

    console.log("Wrote to file succesfully.");

    return true;
}
