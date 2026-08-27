import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
	return res.status(200)
				.json({
					name: "Report API",
					version: "1.0.0",
					endpoints: [
						"/"
					]
				});
})

router.get("/health", (req: Request, res: Response) => {
	return res.status(200)
				.json({
					staturs: "ok"
				});
})

export default router;
