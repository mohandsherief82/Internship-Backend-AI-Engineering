import z from "zod";

export const JobExtractionInput = z.object({
  text: z.string()
  .min(1, "text cannot be empty")
  .max(5000, "text exceeds max length of 5000 characters"),
});

export type JobDescription = z.infer<typeof JobExtractionInput>;
