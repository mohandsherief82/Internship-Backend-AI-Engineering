import * as cheerio from "cheerio";

import config from "../config/env";

export async function fetchHTML() {
    return await cheerio.fromURL(config.target, {
        requestOptions: {
            method: "GET",
            headers: {
                "user-agent": config.userAgent,
            },
            headersTimeout: config.timeout,
        }
    });
}
