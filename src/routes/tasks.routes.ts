import { Router, Request, Response, NextFunction } from 'express';

import { getTasks, getTaskByID, deleteTaskById
            , resetDB, getCounts, insertTask, updateTask } from '../services/tasks.services.js';
import { Task } from '../db/database.js';
import { ValidationError } from '../errors.js';

const router = Router();

router.get('/tasks', (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(200).json(getTasks());
    } catch (err) {
        next(err);
    }
});

router.get('/tasks/:id', (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
        const taskID = parseInt(req.params.id, 10);

        const task = getTaskByID(taskID);

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

        return res.status(201).json(task);
    } catch (err) {
        next(err);
    }
});

router.put('/tasks/:id', (req: Request<{id: string}, {}, Omit<Task, 'id' & 'title'>>, res: Response, next: NextFunction) => {
    if (!req.body) {
        next(new ValidationError("Invalid or missing JSON payload."));
    }

    const { done } = req.body;

    const taskID = parseInt(req.params.id, 10);

    try {
        updateTask(taskID, done);

        return res.status(200).json();
    } catch (err) {
        next(err);
    }
});

router.delete('/tasks/:id', (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
        const taskID = parseInt(req.params.id, 10);

        deleteTaskById(taskID);

        return res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

router.post('/reset', (req: Request, res: Response, next: NextFunction) => {
    try {
        resetDB();

        return res.status(200)
                .json({
                    message: "Database successfully reset to seed data.",
                    tasks: getTasks()
                });
    } catch (err) {
        next(err);
    }
});

router.get('/stats', (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(200).json(getCounts());
    } catch (err) {
        next(err);
    }
})

export default router;