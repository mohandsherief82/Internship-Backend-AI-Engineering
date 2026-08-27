import { sayHello } from "./functions/say-hello"; 
import { makeReport } from "./functions/events/make_report";
import{ heartbeat } from "./functions/cron/heartbeat";

export const functions = [
	sayHello,
	makeReport,
	heartbeat
];
