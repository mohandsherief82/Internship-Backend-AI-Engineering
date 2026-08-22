import { fetcher } from "./utils";

import { parseHTML, extractProductNames, extractRecords } from "./scrapper/utils.scrapper";
import config from "./config/env";
import { Record } from "./scrapper/schema";

import * as cheerio from "cheerio";

const records: Record[] = [];

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

        const newRecord = await extractRecords(storagePath, source);

        records.push(newRecord);
    }
}

console.log(records[0], "\n", `detail_paes = ${records.length}`);

console.log("\nDone scrapping....");
