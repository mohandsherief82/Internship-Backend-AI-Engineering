import { z } from "zod";

export const RecordSchema = z.object({
  	title: z
		.string()
		.default("Untitled Product"),

  	product_url: z
		.string()
		.url()
		.default("https://example.com"),

    price_text: z
		.string()
		.default("£0.00"),

  	price_gbp: z
		.number()
		.nonnegative()
		.default(0),

  	availability_text: z
		.string()
		.default("Unknown"),

  	rating_text: z
		.union([
			z.number(),
			z.string().transform((value) => parseFloat(value)),
		])
		.pipe(z.number())
		.catch(0)
		.default(0),

  	description: z
		.string()
		.optional(),

  	source_page: z
		.string()
		.url()
		.default("https://example.com"),

  	fetched_at: z
		.string()
		.datetime()
		.default(() => new Date().toISOString()),
});

export type Record = z.infer<typeof RecordSchema>;

export interface FailedRecord {
  rawInput: unknown;
  reasons: globalThis.Record<string, string[]>;
  failedAt: string;
}
