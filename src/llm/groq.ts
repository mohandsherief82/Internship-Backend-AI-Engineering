import Groq from "groq-sdk";

import { MissingConfigError } from "../errors.js";
import config from "../config/env.js";

if (!config.groqKey) {
  throw new MissingConfigError("Missing Groq API Key in environment config.");
}

export type Messages = Groq.Chat.Completions.ChatCompletionMessageParam;

export const groq = new Groq({
    apiKey: config.groqKey,
    timeout: 30000,
    maxRetries: 0
});

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getBackoffWithJitter(attempt: number, retryAfterHeader?: string | null): number {
  if (retryAfterHeader) {
    const seconds = parseFloat(retryAfterHeader);
    
    if (!isNaN(seconds)) return seconds * 1000;
  }

  return Math.pow(2, attempt) * 1000 + Math.random() * 500;
}
