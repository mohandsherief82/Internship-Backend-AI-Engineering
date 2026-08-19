import dotenv from "dotenv";

interface Config {
    userAgent: string;
    target: string;
    timeout: number;
}

dotenv.config();

const config: Config = {
    userAgent: process.env.USER_AGENT || "",
    target: process.env.TARGET || "",
    timeout: Number(process.env.TIMEOUT) || 3000
};

export default config;
