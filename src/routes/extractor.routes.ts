import { Router, Request, Response, NextFunction } from 'express';

import { ValidationError, NotFoundError } from '../errors.js';

import config from "../config/env.js";

import groq from "../llm/groq.js";
import { JobExtractionInput } from "../llm/schema.js";

const router = Router();

router.post("/extractor", async (req: Request, res: Response, next: NextFunction) => {
    const parsed = JobExtractionInput.safeParse(req.body);

    if (!parsed.success) {
        return next(new ValidationError("Missing job description text"));
    }

    if (config.stubModel == 1) {
        return res.status(200).json({
            seniority: "lead",
            primary_language: "csharp",
            remote_status: "on_site",
            confidence: 0.95,
            reason: "Mock Object",
        });
    } else {
        // TODO: Add the AI API call extracting the data.
    }
});

export default router;
