	import { inngest } from "../../client";

	import { buildReport, failedReport } from "../../../services/report.services";

	import config from "../../../config/env";

	export const makeReport = inngest.createFunction(
		{
			id: "make-report",
			triggers: [{ event: "report/requested"}],
			retries: config.retries,
			onFailure: ({ event, error }) => {
				failedReport(event.data.event.data.id, error.message);
			}
		},
		async ({ event, step }) => {
			if (event.data.topic === "fail") {
				console.log("Will try again...");
				
				throw new Error("The report oven is broken!");
			}

			await step.sleep("do-the-slow-work", "8s");

			await step.run("build-report", async () => {
				return await buildReport(event.data.id, event.data.topic);
			});
		}
	);