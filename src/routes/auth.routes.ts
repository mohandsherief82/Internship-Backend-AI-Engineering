import { Router, Request, Response, NextFunction } from 'express';

import {  } from '../services/auth.services.js';
import { Task } from '../db/database.js';
import { ValidationError, NotFoundError } from '../errors.js';

const router = Router();

router.post('/auth/signup', (req: Request, res: Response) => {
});

router.post('/auth/login', (req: Request, res: Response) => {
    
});

export default router;