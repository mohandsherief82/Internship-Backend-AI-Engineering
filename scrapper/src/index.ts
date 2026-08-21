import { fetcher } from "./utils";

import { parseHTML, extractProductLinks } from "./scrapper/utils.scrapper";
import config from "./config/env";
import * as cheerio from "cheerio";

for (let i = 1; i <= config.pageLimit; ++i) {
    await fetcher(`${config.target}page-${i}.html`, `catalogue-page-${i}.html`);
}

console.log("\nDone scrapping....");

const $ = await parseHTML("./scrapper/cache/catalogue-page-1.html");

const extractedLinks = extractProductLinks($, config.target);

console.log(`catalogue_pages=${config.pageLimit}, discovered=${extractedLinks.length}, unique_urls=${extractedLinks.length}`);
