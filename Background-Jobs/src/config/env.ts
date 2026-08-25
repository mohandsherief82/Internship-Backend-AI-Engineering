import dotenv from "dotenv";

interface Config {
	port: number;
}

dotenv.config();

const config = {
	port: Number(process.env.PORT) || 3000
};

export default config;
