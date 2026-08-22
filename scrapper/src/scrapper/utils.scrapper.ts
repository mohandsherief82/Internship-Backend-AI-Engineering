import * as cheerio from "cheerio";
import { Record } from "./schema";

import * as fs from "node:fs";

import config from "../config/env";
import { getFetchDate, slugToTitle } from "../utils";

const RATING_MAP: { [key: string]: number } = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
};

export async function parseHTML(targetFile: string) {
	const state = await  fs.existsSync(targetFile);

    if (state) {
        const htmlContent = fs.readFileSync(targetFile, "utf-8");

        return cheerio.load(htmlContent);
    }

    return await cheerio.load(targetFile);
}

export function extractProductNames($: cheerio.CheerioAPI) : string[] {
  const extractedLinks: string[] = [];

  $(".image_container a").each((_, element) => {
    const relativeHref = $(element).attr("href");
    const productName = relativeHref?.split("/")[0];

    if (productName) {
      extractedLinks.push(productName);
    }
  });

  return Array.from(new Set(extractedLinks));
}

export async function extractRecords(storagePath: string, sourcePage: string) : Promise<Record> {
    const $_book = await parseHTML("./scrapper/cache/" + storagePath);

    const urlSlug = storagePath.slice(5, -5);

    const pageTitle = slugToTitle(urlSlug);
    const price = Number($_book(".price_color").text().split("£")[1]) || 0;
    const availabilityText = $_book("p.instock").text().trim();

    const ratingClasses = $_book(".star-rating").attr("class")?.split(/\s+/) || [];
  
    const ratingWord = ratingClasses
        .find((cls) => RATING_MAP[cls.toLowerCase()])
        ?.toLowerCase();

    const rating_text = ratingWord ? RATING_MAP[ratingWord] : 0;

    const description = $_book("#product_description + p").text().trim();

    return {
        title: pageTitle,
        product_url: config.target + urlSlug + "/index.html",
        price_text: price,
        availability_text: availabilityText,
        rating_text: rating_text,
        description: description,
        source_page: sourcePage,
        fetched_at: String(getFetchDate(storagePath))
    };
}
