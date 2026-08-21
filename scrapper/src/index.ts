import { fetcher } from "./utils";

import { parseHTML, extractProductLinks } from "./scrapper/utils.scrapper";
import config from "./config/env";
import * as cheerio from "cheerio";


console.log("Started scrapping....\n");

for (let i = 1; i <= config.pageLimit; ++i) {
    await fetcher(`${config.target}page-${i}.html`, `catalogue-page-${i}.html`);

    const $_1 = await parseHTML(`./scrapper/cache/catalogue-page-${i}.html`);

    const extractedLinks = extractProductLinks($_1, config.target);
    
    console.log("Started record extraction....");
    // for (const link in extractedLinks) {
    //     await fetcher(link, ``);

    //     const $ = parseHTML
    // }
}

console.log("\nDone scrapping....");
