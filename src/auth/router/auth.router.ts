import { Router } from 'express';

import { APP_ROUTES } from '../../core/constants';
import { loginInputModelMiddleware } from '../middleware';

import { loginHandler } from './handlers/login.handler';

export const authRouter = Router();

authRouter.post(APP_ROUTES.AUTH_LOGIN, loginInputModelMiddleware, loginHandler);
