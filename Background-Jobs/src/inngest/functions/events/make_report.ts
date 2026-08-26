import { inngest } from "../../client";

import { buildReport } from "../../../services/report.services";

export const makeReport = inngest.createFunction(
	{
		id: "make-report",
		triggers: [{ event: "report/requested"}]
	},
	async ({ event, step }) => {
		await step.sleep("do-the-slow-work", "8s");

		await step.run("build-report", async () => {
			return await buildReport(event.data.id, event.data.topic);
		});
	}
);