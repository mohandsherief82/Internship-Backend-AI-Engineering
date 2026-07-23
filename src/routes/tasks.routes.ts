import { Router, Request, Response } from 'express';

import { getTasks, getTaskByID, Task, SEED_TASKS } from '../db/database.js'

let tasks: Task[] = SEED_TASKS;

const router = Router();

// Tasks route handler
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

    return res.status(200)
              .json(task);
});

router.post('/tasks', (req: Request<{}, {}, Omit<Task, 'id' | 'done'>>, res: Response) => {
    if (!req.body) {
        return res.status(400).json({ error: "Invalid or missing JSON payload." });
    }
    
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400)
                  .json( { error: "Missing or Empty task title." } );
    }

    const nextID = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 0;

    const newTask: Task = {id: nextID, title: title, done: false};

    tasks.push(newTask);

    return res.status(201).json(newTask);
});

router.put('/tasks/:id', (req: Request<{id: string}, {}, Omit<Task, 'id'>>, res: Response) => {
    if (!req.body) {
        return res.status(400).json({ error: "Invalid or missing JSON payload." });
    }

    const { title, done } = req.body;
    

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400)
                  .json({ error: "Title is required and must be a non-empty string." });
    }

    if (typeof done !== 'boolean') {
        return res.status(400)
                  .json({ error: "Done status is required and must be a boolean." });
    }

    const taskID = parseInt(req.params.id, 10);

    const foundTask = tasks.find(task => task.id === taskID);

    if (!foundTask) {
        return res.status(404)
                  .json({ error: `Task ${taskID} not found` });
    }

    foundTask.title = title;
    foundTask.done = done;

    return res.status(200).json(foundTask);
});

router.delete('/tasks/:id', (req: Request<{id: string}>, res: Response) => {
    const taskID = parseInt(req.params.id, 10);

    const foundTask = tasks.find(task => task.id === taskID);

    if (!foundTask) {
        return res.status(404)
                  .json({ error: `Task ${taskID} not found` });
    }

    const index = tasks.indexOf(foundTask);
    
    tasks.splice(index, 1);

    return res.sendStatus(204);
});

router.post('/reset', (req: Request, res: Response) => {
    tasks = [
        {id: 0, title: "Build First CRUD API", done: false},
        {id: 1, title: "Watch a tutorial on Typescript", done: true},
        {id: 2, title: "Finish track", done: false}
    ];

    return res.status(200)
              .json({
                message: "Database successfully reset to seed data.",
                tasks: tasks
              });  
});

router.get('/stats', (req: Request, res: Response) => {
    const lenDone = (tasks.filter(task => task.done == true)).length;
    const len = tasks.length;

    return res.status(200)
              .json({ total: len,  done: lenDone, open: len - lenDone});
})

export default router;