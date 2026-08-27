import { inngest } from "../../client";

import { summary } from "../../../services/report.services";

export const heartbeat = inngest.createFunction(
	{
		id: "heartbeat",
		triggers: { 
			cron: "* * * * *"
		}
	},
	async ({ step }) => {
		const detailSummary: string = summary();

		console.log(detailSummary);
	}

);
