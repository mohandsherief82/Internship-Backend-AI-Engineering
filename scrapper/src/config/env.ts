import dotenv from "dotenv";

interface Config {
    userAgent: string;
    target: string;
    timeout: number;
    pageLimit: number;
}

dotenv.config({ path: "./scrapper/.env" });

const config: Config = {
    userAgent: process.env.USER_AGENT || "",
    target: process.env.TARGET || '',
    timeout: Number(process.env.TIMEOUT) || 3000,
    pageLimit: Number(process.env.PAGE_LIMIT) || 3
};


export default config;
