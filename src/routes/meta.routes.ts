import { Router, Request, Response } from 'express';

const router = Router();

// Root route handler
router.get('/', (req: Request, res: Response) => {
    res.status(200)
    .json({
        name: 'Task API',
        version: "1.0",
        endpoints: [
            "/tasks",
        ]
    });
});

// Health checker route handler
router.get("/health", (req: Request, res: Response) => {
    res.sendStatus(200);
});

export default router;