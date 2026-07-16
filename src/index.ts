import express, {type Express, type Request, type Response} from 'express'

const app: Express = express();
const port: number = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({message: "Hello World!!\n"});
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
