import dotenv from "dotenv";

export type RetryCount =
    | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
    | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;


interface Config {
	port: number;
	retries: RetryCount;
}

dotenv.config();

const config: Config = {
	port: Number(process.env.PORT) || 3000,
	retries: Number(process.env.RETRIES ?? 2) as RetryCount
};

export default config;
