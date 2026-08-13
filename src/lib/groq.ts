import Groq from "groq-sdk";

import config from "../config/env.js";

const groq = new Groq({
    apiKey: config.groqKey
});

export default groq;
