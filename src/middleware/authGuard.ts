import { Request, Response, NextFunction } from "express";
import { validateHeader, validateToken } from "../services/gates.services.js";

export interface AuthenticatedRequest extends Request {
    user?: { id: string; email: string; createdAt: string };
}

export async function authGuard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        validateHeader(authHeader); 

        const token = authHeader.split(" ")[1];
        const [id, email, createdAt] = await validateToken(token);

        req.user = { id, email, createdAt };

        next();
    } catch (err) {
        next(err);
    }
}