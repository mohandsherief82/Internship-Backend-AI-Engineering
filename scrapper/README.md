# Scrapper

### Target Classification

We are going to scrape the site [Books to Scrape](https://books.toscrape.com/), because it is a simple website with good data that can be formated in a structured manner and would be a great training exercise. We are only targeting the first three pages of the home page of the website.

We are going to collect the product information available in each book, which include the price tag, tax, availability, number of reviews, product type and UPC, however we are going to ignore the UPC, as it has no actual value to this project.

### Lane & Installation

* **Lane:** Static HTML Scraping (HTTP + DOM Parsing)
* **Installation:**

```bash
pnpm install
```

#### Run commands

To run the scraper from the root directory:

```bash
pnpm run start
```

### Record Schema

Each scraped book record is outputted in JSON matching the following structure:
```json
{
  "title": "string",
  "product_url": "string (URL)",
  "price_text": "string",
  "price_gbp": "number",
  "availability_text": "string",
  "rating_text": "number (1-5)",
  "description": "string",
  "source_page": "string (URL)",
  "fetched_at": "string (ISO Date)"
}
```

### Politeness Rules

- User-Agent: Identifies the custom scraper clearly in request headers (User-Agent: FlyRank-Scraper/1.0).

- Delay: Enforces a minimum delay of 500ms between consecutive HTTP requests to avoid rate limits or server load.

- Timeout: Implements a strict 10000ms request timeout to drop hung connections cleanly.

- Cache: Uses a local disk-backed cache for fetched HTML pages to eliminate duplicate requests on subsequent runs.

### Limitations

No Dynamic Handling: The scraper relies entirely on standard HTTP requests and static HTML parsing; if the target website updates its frontend to rely on client-side JavaScript rendering, this pipeline will fail to extract data.

### Report of Test Run

This is a sample run example of the file run-report.json content:

```json
{
  "start_time": "2026-08-22T12:12:08.203Z",
  "duration": "0.30s",
  "pages_fetched": 60,
  "cache_hits": 63,
  "valid_records": 60,
  "invalid_records": 0,
  "failed_pages": 0
}
```

This assignment required no headless browser because all target data is fully present within the raw HTML delivered directly by the server, meaning a browser engine would only introduce unnecessary memory overhead and compute cost.

### Ethics Note

Always prioritize official APIs over web scraping whenever one is available. Never attempt to bypass authentication mechanisms, paywalls, or rate-limiting security blocks. Scraping should remain as unobtrusive as possible, collecting strictly the minimal dataset required for the task.
