import { fetcher } from "./utils";
import { parseHTML, extractProductNames, extractRecords } from "./scrapper/utils.scrapper";

import config from "./config/env";
import { Record, RecordSchema, FailedRecord } from "./scrapper/schema";

import fs from "node:fs/promises";
import path from "node:path";

await fs.mkdir(path.resolve(process.cwd(), "scrapper", "cache"), { recursive: true });

const startTimeISO = new Date().toISOString();
const startMs = performance.now();

const validRecords: Record[] = [];
const errorLogs: FailedRecord[] = [];
let reportData = {
    start_time: startTimeISO,
    duration: "",
    pages_fetched: 0,
    cache_hits: 0,
    valid_records: 0,
    failed_pages: 0
};

console.log("Started scrapping....\n");

for (let i = 1; i <= config.pageLimit; ++i) {
    const source = `${config.target}page-${i}.html`;

    const fetchParentState = await fetcher(source, `catalogue-page-${i}.html`);

    switch (fetchParentState) {
        case "hit":
            reportData.cache_hits += 1;
            break;
        case "failure":
            reportData.failed_pages += 1;
            break;
    }

    const $ = await parseHTML(`./cache/catalogue-page-${i}.html`);

    const extractedProductNames = extractProductNames($);
    
    console.log("Started record extraction....",);

    for (const productName of extractedProductNames) {
        const storagePath = `book-${productName}.html`;

        const fetchPageState = await fetcher(config.target + productName + "/index.html", storagePath);
        
        switch (fetchPageState) {
            case "hit":
                reportData.cache_hits += 1;
                break;
            case "failure":
                reportData.failed_pages += 1;
                break;
        }

        const newRawRecord = await extractRecords(storagePath, source);

        const newRecord = RecordSchema.safeParse(newRawRecord);

        if (newRecord.success) {
            validRecords.push(newRecord.data);

            reportData.valid_records += 1;
        } else {
            const fieldErrors = newRecord.error.flatten().fieldErrors;
      
            errorLogs.push({
                rawInput: newRawRecord,
                reasons: fieldErrors as globalThis.Record<string, string[]>,
                failedAt: new Date().toISOString(),
            });
        }

    }
}

console.log("\nDone scrapping....\n");

const endMs = performance.now();
const durationMs = Math.round(endMs - startMs);

reportData.duration = `${(durationMs / 1000).toFixed(2)}s`;
reportData.pages_fetched += validRecords.length;
reportData.failed_pages += errorLogs.length;

console.log("\nWrite Scrapped Objects to file....");

const storageDir = path.resolve(process.cwd(), "output");
await fs.mkdir(storageDir, { recursive: true });

const booksPath = path.join(storageDir, "books.json");
const errorsPath = path.join(storageDir, "errors.json");
const reportPath = path.join(storageDir, "run-report.json")

await fs.writeFile(
    booksPath,
    JSON.stringify(validRecords, null, 2),
    "utf-8"
);

await fs.writeFile(
    errorsPath,
    JSON.stringify(errorLogs, null, 2),
    "utf-8"
);

await fs.writeFile(
    reportPath,
    JSON.stringify(reportData, null, 2),
    "utf-8"
);

console.log(`Saved ${validRecords.length} valid books to books.json`);
console.log(`Logged ${errorLogs.length} invalid items to errors.json`);
