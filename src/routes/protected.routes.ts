import { Router, Response } from "express";
import { authGuard, AuthenticatedRequest } from "../middleware/authGuard.js";

const protectedRouter = Router();

protectedRouter.use(authGuard);

protectedRouter.get("/protected/profile", async (req: AuthenticatedRequest, res: Response) => {
        return res.status(200).json({ profile: req.user });
});

export default protectedRouter;