import groq from "../llm/groq.js";
import { JobExtractionOutput, JobExtractionInput } from "../llm/schema.js";

import config from "../config/env.js";

import { ModelJSONParseError, ModelSchemaValidationError } from "../errors.js";

import fs from 'node:fs/promises';
import path from 'node:path';

const promptCache = new Map<string, string>();

export async function getPrompt(fileName: string): Promise<string> {
  if (promptCache.has(fileName)) {
    return promptCache.get(fileName)!;
  }

  const filePath = path.join(process.cwd(), 'src/prompts', fileName);
  const content = await fs.readFile(filePath, 'utf-8');
  
  promptCache.set(fileName, content);
  return content;
}

export async function extractJobInfo(input: JobExtractionInput): Promise<JobExtractionOutput> {
  const systemPrompt = await getPrompt(config.jobPromptFile);

  const response = await groq.chat.completions.create({
    model: config.llmModel,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: input.text },
    ],
    response_format: { type: "json_object" }, 
    temperature: 0.1,
  });

  const content = response.choices[0]?.message?.content || "{}";

  let rawJson: unknown;
  try {
    rawJson = JSON.parse(content);
  } catch {
    throw new ModelJSONParseError(content);
  }

  const result = JobExtractionOutput.safeParse(rawJson);

  if (!result.success) {
    const issueSummary = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join("; ");

    throw new ModelSchemaValidationError(issueSummary);
  }

  return result.data;
}
