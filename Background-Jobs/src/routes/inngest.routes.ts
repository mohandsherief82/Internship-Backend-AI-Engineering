import { Router, Request, Response } from "express";

import { serve } from "inngest/express";

import { inngest } from "../inngest/client";
import { functions } from "../inngest/index";

const router = Router();

router.use(
  	"/",
  	serve({
    	client: inngest,
    	functions: functions,
	})
);

export default router;
