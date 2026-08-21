import * as cheerio from "cheerio";

import config from "../config/env";

export async function parseHTML(targetFile: string) {
    return await cheerio.load(targetFile);
}

export function extractProductLinks(
    $: cheerio.CheerioAPI, 
    baseUrl: string = 'http://books.toscrape.com/') : string[] {
  const extractedLinks: string[] = [];

  $('.image_container a').each((_, element) => {
    const relativeHref = $(element).attr('href');

    if (relativeHref) {
      const absoluteUrl = new URL(relativeHref, baseUrl).href;

      extractedLinks.push(absoluteUrl);
    }
  });

  return Array.from(new Set(extractedLinks));
}
