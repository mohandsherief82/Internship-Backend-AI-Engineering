import express, { type Express } from "express";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../openapi.json" with { type: 'json' };

import config from "./config/env";
import metaRouter from "./routes/meta.routes";
import inngestRouter from "./routes/inngest.routes";

const app: Express = express();

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/", metaRouter);
app.use("/api/inngest/", inngestRouter);

app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
});
