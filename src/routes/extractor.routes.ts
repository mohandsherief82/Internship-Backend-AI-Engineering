import { Router, Request, Response, NextFunction } from 'express';

import { ValidationError, NotFoundError } from '../errors.js';

import config from "../config/env.js";

import groq from "../llm/groq.js";
import { JobExtractionInput } from "../llm/schema.js";

const router = Router();

router.post("/extractor", async (req: Request, res: Response, next: NextFunction) => {
    const parsed = JobExtractionInput.safeParse(req.body);

    if (!parsed.success) {
        next(new ValidationError("Missing job description text"));
    }

    if (config.skipLLM == 0) {
    }
});

export default router;
