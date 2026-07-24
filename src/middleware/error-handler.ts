import { ValidationError, NotFoundError } from '../errors.js';

import { NextFunction, Request, Response } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    switch (err.name) {
        case ValidationError.name:
            return res.status(400).json({ error: err.message });
        case NotFoundError.name:
            return res.status(404).json({ error: err.message });
        default:
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
    }
}