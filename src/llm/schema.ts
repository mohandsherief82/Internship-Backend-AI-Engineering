import z from "zod";

export const JobExtractionInput = z.object({
  text: z.string()
  .min(1, "Text cannot be empty")
  .max(5000, "Text exceeds max length of 5000 characters"),
});

export const JobExtractionOutput = z.object({
  seniority: z.enum(["junior", "mid", "senior", "lead", "other"]),
  primary_language: z.enum(["python", "javascript", "go", "java", "csharp", "other"]),
  remote_status: z.enum(["remote", "hybrid", "on_site", "other"]),
  confidence: z.number(),
  reason: z.string(),
});

export type JobExtraction = z.infer<typeof JobExtractionOutput>;
export type JobDescription = z.infer<typeof JobExtractionInput>;
