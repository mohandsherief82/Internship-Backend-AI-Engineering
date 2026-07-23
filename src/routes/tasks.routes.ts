import { Router, Request, Response } from 'express';

import { getTasks, getTaskByID, deleteTaskById
            , resetDB, getCounts, insertTask, updateTask, Task } from '../db/database.js'

const router = Router();

router.get('/tasks', (req: Request, res: Response) => {
    return res.status(200).json(getTasks());
});

router.get('/tasks/:id', (req: Request<{id: string}>, res: Response) => {
    const taskID = parseInt(req.params.id, 10);

    const task = getTaskByID(taskID);
    
    if (!task) {
        return res.status(404)
                  .json({ error: `Task ${taskID} not found` });
    }

    return res.status(200).json(task);
});

router.post('/tasks', (req: Request<{}, {}, Omit<Task, 'id'>>, res: Response) => {
    if (!req.body) {
        return res.status(400).json({ error: "Invalid or missing JSON payload." });
    }
    
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400)
                  .json( { error: "Missing or Empty task title." } );
    }

    const newTask: Task = { id: -1, title: title, done: false};
    
    const [ status, id ] = insertTask(newTask);

    newTask.id = id;

    return res.status(201).json(newTask);
});

router.put('/tasks/:id', (req: Request<{id: string}, {}, Omit<Task, 'id' & 'title'>>, res: Response) => {
    if (!req.body) {
        return res.status(400).json({ error: "Invalid or missing JSON payload." });
    }

    const { done } = req.body;

    if (typeof done !== 'boolean') {
        return res.status(400)
                  .json({ error: "Done status is required and must be a boolean." });
    }

    const taskID = parseInt(req.params.id, 10);

    const state = updateTask(taskID, done);

    return res.status(200).json();
});

router.delete('/tasks/:id', (req: Request<{id: string}>, res: Response) => {
    const taskID = parseInt(req.params.id, 10);

    deleteTaskById(taskID);

    return res.sendStatus(204);
});

router.post('/reset', (req: Request, res: Response) => {
    resetDB();

    return res.status(200)
              .json({
                message: "Database successfully reset to seed data.",
                tasks: getTasks()
              });  
});

router.get('/stats', (req: Request, res: Response) => {
    return res.status(200).json(getCounts());
})

export default router;