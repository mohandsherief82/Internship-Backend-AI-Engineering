import { readFromCache, fetchHTML, writeFetchedHTML } from "./utils";

import { parseHTML } from "./scrapper/utils.scrapper";
import config from "./config/env";
import * as cheerio from "cheerio";

try {
    const inCache = await readFromCache("./scrapper/cache/catalogue-page-1.html")

    if (!inCache) {
        const response = await fetchHTML();

        if (response.status === 200) {
            const htmlPage = await response.text();

            await writeFetchedHTML(htmlPage, "./scrapper/cache/catalogue-page-1.html");
        }
    }
} catch (err) {
    console.error(err);
}

console.log("Done scrapping....");
