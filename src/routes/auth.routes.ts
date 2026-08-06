import { Router, Request, Response, NextFunction } from 'express';

import { validateEmail, validatePassword } from '../services/auth.services.js';
import { InvalidCredentialsError, SignUpError } from '../errors.js';
import supabase from "../lib/supabase.js";

const router = Router();

interface AuthRequestBody {
    email?: string;
    password?: string;
}

router.post('/auth/signup', async (req: Request<{}, {}, AuthRequestBody>, res: Response, next: NextFunction) => {
    const { email = '', password: pass = '' } = req.body;

    try {
        validateEmail(email);

        validatePassword(pass);
    } catch (err) {
        next(err);
        return;
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password: pass
    });

    if (error) {
        const customError = new SignUpError(error.message, error.status || 400, error.code);
        next(customError);
        return;
    }

    return res.status(201).json({
        msg: "Created",
        user: data.user
    });
});

router.post('/auth/login', async (req: Request<{}, {}, AuthRequestBody>, res: Response, next: NextFunction) => {
    const { email = '', password: pass = '' } = req.body;
    
    try {
        validateEmail(email);

        validatePassword(pass);
    } catch (err) {
        next(err);
        return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
    });

    if (error) {
        const customError = new InvalidCredentialsError(error.message, 401, error.code);
        next(customError);
        return;
    }

    if (!data.session) {
        return res.status(401).json({
            msg: "Session creation failed or email verification required."
        });
    }

    return res.status(200).json({
        msg: "Login Successful",
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token
    });
});

export default router;