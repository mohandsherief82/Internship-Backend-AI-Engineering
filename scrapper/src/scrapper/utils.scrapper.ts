import * as cheerio from "cheerio";

import config from "../config/env";

export async function parseHTML(targetFile: string) {
    return await cheerio.load(targetFile);
}
