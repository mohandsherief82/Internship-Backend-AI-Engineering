import groq from "../llm/groq.js";
import { JobExtractionOutput, JobExtractionInput } from "../llm/schema.js";

import config from "../config/env.js";

import { ModelSchemaValidationError } from "../errors.js";

import { Groq } from "groq-sdk";

import fs from 'node:fs/promises';
import path from 'node:path';

type Messages = Groq.Chat.Completions.ChatCompletionMessageParam;

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

function cleanJsonContent(content: string): string {
    return content
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")     
        .trim();
}

async function callLLM(messages: Messages[]) {
    return groq.chat.completions.create({
        model: config.llmModel,
        messages: messages,
        response_format: { type: "json_object" }, 
        temperature: 0.1,
    });  
}

export async function extractJobInfo(input: JobExtractionInput): Promise<JobExtractionOutput> {
    const systemPrompt = await getPrompt(config.jobPromptFile);

    const messages: Messages[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: input.text },
    ];

    let response = await callLLM(messages);
    let content = response.choices[0]?.message?.content || "{}";

    let rawJson: unknown = null;
    
    try {
        rawJson = JSON.parse(cleanJsonContent(content));
    } catch {
        rawJson = null; 
    }

    let result = rawJson ? JobExtractionOutput.safeParse(rawJson) : null;

    if (!result || !result.success) {
        const errorMessage = !rawJson
            ? "Your output was not valid JSON."
            : result?.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");

        messages.push({ role: "assistant", content: content });
        messages.push({
            role: "user",
            content: `Your previous answer was rejected for this reason: ${errorMessage}. Return only corrected JSON matching the schema.`,
        });

        response = await callLLM(messages);
        content = response.choices[0]?.message?.content || "";

        try {
            rawJson = JSON.parse(cleanJsonContent(content));
            
			result = JobExtractionOutput.safeParse(rawJson);
        } catch (err) {
            rawJson = null;
            
			result = null;
        }
    }

    if (!result || !result.success) {
        const hasZodError = result && "error" in result && result.error;

		const finalErrorMsg = hasZodError
			? result?.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
			: "Failed to parse JSON into valid schema on retry";
		
        throw new ModelSchemaValidationError(finalErrorMsg || "");
    }

    return result.data;
}
