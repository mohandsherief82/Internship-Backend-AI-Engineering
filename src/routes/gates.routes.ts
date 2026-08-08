import { Router, Request, Response, NextFunction } from "express";
import { validateHeader, validateToken } from "../services/gates.services.js";

const router = Router();

router.get("/public/info", (req: Request, res: Response) => {
    return res.status(200).json({ message: "Welcome stranger! This info is public." });
});

router.get("/protected/profile", (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    try {
        validateHeader(authHeader);

        const token = authHeader!.split(" ")[1];

        validateToken(token);

        return res.status(200);
    } catch (err) {
        console.log(`Caught error: ${err}`);
        next(err);
    }
});

export default router;
