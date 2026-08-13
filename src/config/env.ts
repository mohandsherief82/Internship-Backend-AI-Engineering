import dotenv from "dotenv";

interface Config {
    port: number;
    databaseURL: string;
    supabaseURL: string;
    supabaseKey: string;
    groqKey: string;
    llmModel: string;
}

dotenv.config();

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    databaseURL: process.env.DATABASE_URL || "",
    supabaseURL: process.env.SUPABASE_URL || "",
    supabaseKey: process.env.SUPABASE_KEY || "",
    groqKey: process.env.GROQ_API_KEY || "",
    llmModel: process.env.LLM_MODEL || ""
};

export default config;
