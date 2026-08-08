import { Router, Request, Response } from "express";

const router = Router();

router.get("/public/info", (req: Request, res: Response) => {
    return res.status(200).json({ message: "Welcome stranger! This info is public." });
});

export default router;
