import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { metaRouter } from "./routes/meta";
import { tasksRouter } from "./routes/tasks";
import openApiSpec from "./openapi.json";

export function createApp(): Express {
  const app = express();

  app.use(express.json());

  // Stage 1: root ("/") and health ("/health")
  app.use("/", metaRouter);

  // Stage 2-4: task CRUD
  app.use("/tasks", tasksRouter);

  // Stage 5: OpenAPI/Swagger docs
  app.get("/openapi.json", (_req: Request, res: Response) => {
    res.status(200).json(openApiSpec);
  });
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

  // Fallback 404 for anything unmatched
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}
