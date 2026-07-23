import swaggerUi from 'swagger-ui-express';
import swaggerDocument from "../openapi.json";

import db from './db/database.js'
import tasksRouter from './routes/tasks.routes.js';
import metaRouter from './routes/meta.routes.js';

import express, {type Express, type Request, type Response} from 'express'

// Initializing the server
const app: Express = express();
const port: number = 3000;

app.use(express.json());

// Serve interactive Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', metaRouter);
app.use('/', tasksRouter)

// Bind app to port and starts event loop
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
