import { parseData, readFromCache } from "./utils";

import { fetchHTML } from "./scrapper/utils.scrapper";

try {
    let {inCache, htmlPage} = await readFromCache("./scrapper/cache/catalogue-page-1.html");

    if (!inCache) {
        htmlPage = (await fetchHTML()).html();
    }

    const parseStatus = parseData(htmlPage, inCache);
} catch (err) {
    console.error(err);
}

console.log("Done scrapping....");
