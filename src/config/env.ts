
import dotenv from "dotenv";

interface Config {
    port: number;
    databaseURL: string;
    supabaseURL: string;
    supabaseKey: string;
}

dotenv.config();

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    databaseURL: process.env.databaseURL || "",
    supabaseURL: process.env.supabaseURL || "",
    supabaseKey: process.env.supabaseKey || ""
};

export default config;
