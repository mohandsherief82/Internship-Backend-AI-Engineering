import { Router, Request, Response, NextFunction } from 'express';

import { getTasks, getTaskByID, deleteTaskById
            , resetDB, getCounts, insertTask, updateTask } from '../services/tasks.services.js';
import { Task } from '../db/database.js';
import { ValidationError, NotFoundError } from '../errors.js';

const router = Router();

router.get('/tasks', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks: Task[] = await getTasks();

        if (tasks.length == 0) {
            console.log("Empty database fetched.")
        } else {
            console.log(`Fetched all tasks:\n${tasks}`);
        }

        return res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
});

router.get('/tasks/:id', async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
        const taskID = parseInt(req.params.id, 10);

        const task = await getTaskByID(taskID);

        if (!task) {
            throw new NotFoundError(`Task with ID ${taskID} was not found.`);
        }

        return res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

router.post('/tasks', async (req: Request<{}, {}, Omit<Task, 'id'>>, res: Response, next: NextFunction) => {
    if (!req.body) {
        next(new ValidationError("Invalid or missing JSON payload."));
    }
    
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        next(new ValidationError("Invalid or missing task title."));
    }

    try {
        const newTask: Task = { id: -1, title: title, done: false};
    
        const task = await insertTask(newTask);

        if (!task) {
            throw new Error("Failed to insert task");
        }
        
        console.log("Added new task successfully");

        return res.status(201).json(task);
    } catch (err) {
        next(err);
    }
});

router.put('/tasks/:id', async (req: Request<{id: string}, {}, Omit<Task, 'id' & 'title'>>, res: Response, next: NextFunction) => {
    if (!req.body) {
        next(new ValidationError("Invalid or missing JSON payload."));
    }

    const { done } = req.body;

    const taskID = parseInt(req.params.id, 10);

    try {
        const task = await updateTask(taskID, done);

        if (!task) {
            throw new NotFoundError(`Task with ID ${taskID} was not found.`);
        }

        return res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

router.delete('/tasks/:id', async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
        const taskID = parseInt(req.params.id, 10);

        await deleteTaskById(taskID);

        return res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

router.post('/reset', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await resetDB();

        const tasks = await getTasks();

        return res.status(200)
                .json({
                    message: "Database successfully reset to seed data.",
                    tasks
                });
    } catch (err) {
        next(err);
    }
});

router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(200).json(await getCounts());
    } catch (err) {
        next(err);
    }
})

export default router;