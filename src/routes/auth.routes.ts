import { Router, Request, Response, NextFunction } from 'express';

import { validateEmail, validatePassword } from '../services/auth.services.js';
import { Task } from '../db/database.js';
import { ValidationError, NotFoundError } from '../errors.js';

const router = Router();

router.post('/auth/signup', async (req: Request<{email: string, password: string}>, res: Response, next: NextFunction) => {
    const email = req.params.email;
    const pass = req.params.password;

    try {
        validateEmail(email);

        validatePassword(pass);
    } catch (err) {
        next(err);
    }

});

router.post('/auth/login', (req: Request, res: Response) => {
    
});

export default router;