import groq from "./groq.js";
import config from "../config/env.js";

const res = await groq.chat.completions.create({
    model: config.llmModel || "llama-3.3-70b-versatile",
    messages: [{role: "user", content: "Reply with exactly the word: ready"}]
});
