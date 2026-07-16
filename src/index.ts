import express, {type Express, type Request, type Response} from 'express'

// Initializing the server
const app: Express = express();
const port: number = 3000;

app.use(express.json());

// Root route handler
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({message: "Hello World!!\n"});
});

// Bind app to port and starts event loop
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
