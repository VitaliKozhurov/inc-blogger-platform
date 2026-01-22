import { Router } from 'express';

import { APP_ROUTES } from '../../core/constants';

import { loginHandler } from './handlers/login.handler';

export const authRouter = Router();

authRouter.post(APP_ROUTES.AUTH_LOGIN, loginHandler);
