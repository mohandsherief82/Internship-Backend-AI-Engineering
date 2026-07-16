import express, {type Express, type Request, type Response} from 'express'

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

// Bind app to port and starts event loop
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
