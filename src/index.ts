import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../openapi.json" with { type: 'json' };

import tasksRouter from "./routes/tasks.routes.js";
import metaRouter from "./routes/meta.routes.js";
import authRouter from "./routes/auth.routes.js";
import gatesRouter from "./routes/gates.routes.js";
import config from "./config/env.js";

import { errorHandler } from "./middleware/error-handler.js";

import express, { type Express } from 'express';

// Initializing the server
const app: Express = express();
const port: number = config.port;

app.use(express.json());

// Serve interactive Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use the paths
app.use('/', metaRouter);
app.use('/', gatesRouter);
app.use('/', authRouter);
app.use('/', tasksRouter);

app.use(errorHandler);

// Bind app to port and starts event loop
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
