import { Router, Request, Response } from 'express';
import { pool } from '../db/database.js'

const router = Router();

// Root route handler
router.get('/', (req: Request, res: Response) => {
    res.status(200)
            .json({
                name: 'Task API',
                version: "1.0",
                endpoints: [
                    "/tasks",
                ]}
            );
});

// Health checker route handler
router.get("/health", async (req: Request, resp: Response) => {
    const res = await pool.query('SELECT 1 AS alive');

    resp.status(200)
         .json({ 
            backend: "ok", 
            database: res.rows[0].alive == 1 ? "ok" : "down" 
        }
    );
});

export default router;