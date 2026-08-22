import { fetcher } from "./utils";
import { parseHTML, extractProductNames, extractRecords } from "./scrapper/utils.scrapper";

import config from "./config/env";
import { Record, RecordSchema, FailedRecord } from "./scrapper/schema";

import fs from "node:fs/promises";
import path from "node:path";

const validRecords: Record[] = [];
const errorLogs: FailedRecord[] = [];

console.log("Started scrapping....\n");

for (let i = 1; i <= config.pageLimit; ++i) {
    const source = `${config.target}page-${i}.html`;

    await fetcher(source, `catalogue-page-${i}.html`);

    const $ = await parseHTML(`./scrapper/cache/catalogue-page-${i}.html`);

    const extractedProductNames = extractProductNames($);
    
    console.log("Started record extraction....",);

    for (const productName of extractedProductNames) {
        const storagePath = `book-${productName}.html`;

        await fetcher(config.target + productName + "/index.html", storagePath);

        const newRawRecord = await extractRecords(storagePath, source);

        const newRecord = RecordSchema.safeParse(newRawRecord);

        if (newRecord.success) {
            validRecords.push(newRecord.data);
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

console.log("\nWrite Scrapped Objects to file....");

const storageDir = path.resolve(process.cwd(), "scrapper", "output");
await fs.mkdir(storageDir, { recursive: true });

const booksPath = path.join(storageDir, "books.json");
const errorsPath = path.join(storageDir, "errors.json");

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

console.log(`Saved ${validRecords.length} valid books to books.json`);
console.log(`Logged ${errorLogs.length} invalid items to errors.json`);
