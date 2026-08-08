import { Router, Response, NextFunction } from "express";
import { authGuard, AuthenticatedRequest } from "../middleware/authGuard.js";
import supabase from "../lib/supabase.js";

const protectedRouter = Router();

protectedRouter.use(authGuard);

protectedRouter.get("/protected/profile", async (req: AuthenticatedRequest, res: Response) => {
        return res.status(200).json({ profile: req.user });
});

protectedRouter.get("/protected/dashboard",async (req: AuthenticatedRequest, res: Response) => {
    return res.status(200).json({ email: req.user?.email });
});

protectedRouter.post("/auth/logout", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        return res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

export default protectedRouter;