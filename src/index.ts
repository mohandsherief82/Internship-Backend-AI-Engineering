import express, {type Express, type Request, type Response} from 'express'

// Custom type handling tasks
interface Task {
    id: number,
    title: string,
    done: boolean
}

const tasks: Task[] = [
    {id: 0, title: "Build First CRUD API", done: false},
    {id: 1, title: "Watch a tutorial on Typescript", done: true},
    {id: 2, title: "Finish track", done: false}
];

// Initializing the server
const app: Express = express();
const port: number = 3000;

app.use(express.json());

// Root route handler
app.get('/', (req: Request, res: Response) => {
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
app.get("/health", (req: Request, res: Response) => {
    res.sendStatus(200);
});

// Tasks route handler
app.get('/tasks', (req: Request, res: Response) => {
    if (tasks.length === 0) {
        return res.sendStatus(204); 
    }
    return res.status(200).json(tasks);
});

app.get('/tasks/:id', (req: Request<{id: string}>, res: Response) => {
    const taskID = parseInt(req.params.id, 10);
    
    const foundTask = tasks.find(task => task.id === taskID);

    if (!foundTask) {
        return res.status(404)
                  .json({ error: "Task 99 not found" });
    }

    return res.status(200)
              .json(foundTask);
});

app.post('/tasks', (req: Request<{}, {}, Omit<Task, 'id' | 'done'>>, res: Response) => {
    if (!req.body) {
        return res.status(400).json({ error: "Invalid or missing JSON payload." });
    }
    
    const { title } = req.body;

    if (!title || typeof title !== 'string') {
        return res.status(400)
                  .json("Missing or Empty task title.");
    }

    const nextID = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 0;

    const newTask: Task = {id: nextID, title: title, done: false};

    tasks.push(newTask);

    return res.status(201).json(newTask);
});

// Bind app to port and starts event loop
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
