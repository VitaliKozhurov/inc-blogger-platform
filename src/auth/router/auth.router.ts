import { Router } from 'express';

import { APP_ROUTES } from '../../core/constants';
import { checkValidationMiddleware } from '../../core/middleware';
import { accessTokenMiddleware, loginInputModelMiddleware } from '../middleware';

import { loginHandler } from './handlers/login.handler';
import { meHandler } from './handlers/me.handler';

export const authRouter = Router();

authRouter.post(
  APP_ROUTES.AUTH_LOGIN,
  loginInputModelMiddleware,
  checkValidationMiddleware,
  loginHandler
);

authRouter.get(APP_ROUTES.AUTH_ME, accessTokenMiddleware, meHandler);
