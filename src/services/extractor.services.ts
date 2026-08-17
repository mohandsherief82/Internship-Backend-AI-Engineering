import { groq, Messages, getBackoffWithJitter, sleep } from "../llm/groq.js";
import { JobExtractionOutput, JobExtractionInput } from "../llm/schema.js";

import config from "../config/env.js";

import { ModelSchemaValidationError } from "../errors.js";

import { Groq } from "groq-sdk";

import fs from 'node:fs/promises';
import path from 'node:path';

const promptCache = new Map<string, string>();

async function appendToLogs(logData: Record<string, unknown>, logPath: string) {
    const logDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logDir, logPath);

    try {
        await fs.mkdir(logDir, { recursive: true });

        const line = JSON.stringify(logData) + '\n';

        await fs.appendFile(logFile, line, 'utf-8');
    } catch (error) {
        console.error('Failed to write to quarantine log:', error);
    }
}

async function getPrompt(fileName: string): Promise<string> {
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
    const maxAttempts = 3;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            return await groq.chat.completions.create({
                model: config.llmModel,
                messages,
                response_format: { type: 'json_object' },
                temperature: 0.1,
            });
        } catch (error: any) {
            const status = error?.status || error?.statusCode;

            if (status && status >= 400 && status < 500 && status !== 429) {
                throw error;
            }

            if (attempt === maxAttempts - 1) {
                throw error;
            }

            const retryAfter = error?.headers?.get?.('retry-after') || error?.headers?.['retry-after'];
            const delayMs = getBackoffWithJitter(attempt, retryAfter);

            console.warn(`[Groq Retry] Attempt ${attempt + 1} failed (Status: ${status || 'Timeout'}). Retrying in ${Math.round(delayMs)}ms...`);
            await sleep(delayMs);
        }
    }

    throw new Error('Max retries exceeded');
}

export async function extractJobInfo(input: JobExtractionInput): Promise<JobExtractionOutput> {
    const startTime = Date.now();
    let repairNeeded = false;
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
        repairNeeded = true;
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

		await appendToLogs({
			timestamp: new Date().toISOString(),
			input: input.text,
			rawModelOutput: content,
			error: finalErrorMsg,
			promptFile: config.jobPromptFile,
		}, 'quarantine.jsonl');
		
        throw new ModelSchemaValidationError(finalErrorMsg || "");
    }

    const durationMs = Date.now() - startTime;
    const promptTokens = response.usage?.prompt_tokens ?? 0;
    const completionTokens = response.usage?.completion_tokens ?? 0;

    await appendToLogs({
        event: "llm_call_completed",
        promptFile: config.jobPromptFile,
        model: config.llmModel,
        inputTokens: promptTokens,
        outputTokens: completionTokens,
        totalTokens: promptTokens + completionTokens,
        durationMs,
        repairNeeded,
    }, `logs.jsonl`);

    return result.data;
}
