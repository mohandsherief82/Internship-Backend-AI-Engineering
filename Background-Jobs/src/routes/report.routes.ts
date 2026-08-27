import { Router, Request, Response, NextFunction } from "express";

import { Report, reportsStore } from "../services/report.services";

import { inngest } from "../inngest/client";
import { NotFoundError, ValidationError } from "../errors";

const router = Router();

router.post("/", async (req: Request<{topic: string}>, res: Response, next: NextFunction) => {
	const topic = req.body?.topic;
	const reportId = crypto.randomUUID();

	if (!topic) {
		next(new ValidationError("Missing input topic from request."));

		return;
	}

	const newReport: Report = {
		id: `make-report-${reportId}`,
		status: "pending",
		createdAt: new Date(),
		topic: topic
	};

	reportsStore.set(newReport.id, newReport);

	await inngest.send({
		name: "report/requested",
		data: {
			id: newReport.id,
			topic:newReport.topic
		}
	});

	return res.status(202)
				.json({
					message: "I have the order, work starts soon",
					body: {
						id: newReport.id,
						status: newReport.status,
					}
				});
});

router.get("/:id",(req: Request<{id: string}>, res: Response, next: NextFunction) => {
	const reportId = req.params.id;

	const generatedReport = reportsStore.get(reportId);

	if (!generatedReport) {
		next(new NotFoundError(`Report with id ${reportId} not Found.`));

		return;
	}

	return res.status(200)
				.json({
					data: {
						id: generatedReport.id,
						data: generatedReport.data,
						status: generatedReport.status
					}
				});
});

export default router;