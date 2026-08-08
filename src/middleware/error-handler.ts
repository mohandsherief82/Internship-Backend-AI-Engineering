import { ValidationError, NotFoundError, MissingConfigError, SignUpError,
    InvalidCredentialsError, AuthError } from '../errors.js';
import { NextFunction, Request, Response } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message });
    }

    if (err instanceof NotFoundError) {
        return res.status(404).json({ error: err.message });
    }

    if (err instanceof MissingConfigError) {
        return res.status(503).json({ error: err.message });
    }

    if (err instanceof InvalidCredentialsError) {
        return res.status(401).json({ error: err.message });
    }

    if (err instanceof AuthError) {
        return res.status(401).json({ error: err.message });
    }

    if (err instanceof SignUpError) {
        return res.status(err.statusCode).json({
            error: err.message,
            code: err.code,
        });
    }

    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
}