import { fetcher } from "./utils";

import { parseHTML, extractProductLinks } from "./scrapper/utils.scrapper";
import config from "./config/env";
import * as cheerio from "cheerio";

await fetcher(config.target);

console.log("Done scrapping....");

const $ = await parseHTML("./scrapper/cache/catalogue-page-1.html");

const extracted_links = extractProductLinks($, config.target);
