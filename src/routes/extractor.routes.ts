import { Router, Request, Response, NextFunction } from 'express';

import { ValidationError } from '../errors.js';

import config from "../config/env.js";

import { JobExtractionInput } from "../llm/schema.js";

import { extractJobInfo } from "../services/extractor.services.js";

const router = Router();

router.post("/extractor", async (req: Request, res: Response, next: NextFunction) => {
    const parsed = JobExtractionInput.safeParse(req.body);

    if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0]?.message));
    }

    if (config.stubModel === 1) {
        return res.status(200).json({
            seniority: "lead",
            primary_language: "csharp",
            remote_status: "on_site",
            confidence: 0.95,
            reason: "Mock Object",
        });
    } else {
        try {
            const output = await extractJobInfo(parsed.data);
        } catch (error) {
            return next(error);
        }
    }
});

export default router;
