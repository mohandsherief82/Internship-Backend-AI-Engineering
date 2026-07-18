import { Router, Request, Response } from "express";

export const metaRouter = Router();

// GET / — basic API info
metaRouter.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    name: "Task API",
    version: "2.0",
    endpoints: ["/tasks"],
  });
});

// GET /health — server status
metaRouter.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
