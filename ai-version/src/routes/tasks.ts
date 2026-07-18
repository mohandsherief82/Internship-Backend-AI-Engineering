import { Router, Request, Response } from "express";
import { taskStore } from "../data";
import { CreateTaskBody, UpdateTaskBody } from "../types";

export const tasksRouter = Router();

/**
 * Parses and validates an `:id` route param.
 * Returns the numeric id, or null if it isn't a valid positive integer.
 */
function parseId(raw: string): number | null {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

// GET /tasks — list every task
tasksRouter.get("/", (_req: Request, res: Response) => {
  res.status(200).json(taskStore.getAll());
});

// GET /tasks/:id — fetch a single task by id
tasksRouter.get("/:id", (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "id must be a positive integer" });
  }

  const task = taskStore.getById(id);
  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  return res.status(200).json(task);
});

// POST /tasks — create a task from { title }
tasksRouter.post("/", (req: Request<{}, {}, CreateTaskBody>, res: Response) => {
  const { title } = req.body ?? {};

  if (typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ error: "title is required and must be a non-empty string" });
  }

  const task = taskStore.create(title.trim());
  return res.status(201).json(task);
});

// PUT /tasks/:id — replace title and/or done status
tasksRouter.put("/:id", (req: Request<{ id: string }, {}, UpdateTaskBody>, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "id must be a positive integer" });
  }

  const { title, done } = req.body ?? {};

  if (title === undefined && done === undefined) {
    return res.status(400).json({ error: "provide at least one of: title, done" });
  }
  if (title !== undefined && (typeof title !== "string" || title.trim().length === 0)) {
    return res.status(400).json({ error: "title must be a non-empty string" });
  }
  if (done !== undefined && typeof done !== "boolean") {
    return res.status(400).json({ error: "done must be a boolean" });
  }

  const updated = taskStore.update(id, {
    title: title !== undefined ? title.trim() : undefined,
    done,
  });

  if (!updated) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  return res.status(200).json(updated);
});

// DELETE /tasks/:id — remove a task by id
tasksRouter.delete("/:id", (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "id must be a positive integer" });
  }

  const deleted = taskStore.delete(id);
  if (!deleted) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  return res.status(204).send();
});
