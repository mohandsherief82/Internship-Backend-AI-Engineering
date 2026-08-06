import { Router, Request, Response, NextFunction } from 'express';

import { validateEmail, validatePassword } from '../services/auth.services.js';
import { Task } from '../db/database.js';
import { AuthError } from '../errors.js';
import supabase from "../lib/supabase.js";

const router = Router();

router.post('/auth/signup', async (req: Request<{email: string, password: string}>, res: Response, next: NextFunction) => {
    const { email, pass } = req.body;

    try {
        validateEmail(email);

        validatePassword(pass);
    } catch (err) {
        next(err);
        return;
    }

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: pass
    });

    if (error) {
        const customError = new AuthError(error.message, error.status || 400, error.code);
        next(customError);
        return;
    }

    return res.status(201).json({
        msg: "Created",
        data: data
    });
});

router.post('/auth/login', (req: Request, res: Response) => {
    
});

export default router;