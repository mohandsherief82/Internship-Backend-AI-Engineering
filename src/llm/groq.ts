import Groq from "groq-sdk";

import { MissingConfigError } from "../errors.js";
import config from "../config/env.js";

if (!config.groqKey) {
  throw new MissingConfigError("Missing Groq API Key in environment config.");
}

const groq = new Groq({
    apiKey: config.groqKey,
    timeout: 30000,
    maxRetries: 0
});

export default groq;
