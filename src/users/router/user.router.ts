import { Router } from 'express';

import { basicAuthMiddleware } from '../../auth/middleware';
import { APP_ROUTES } from '../../core/constants';
import { checkValidationMiddleware, idUriParamMiddleware } from '../../core/middleware';
import { userInputModelMiddleware, usersInputQueryMiddleware } from '../middleware';

import { createUserHandler } from './handlers/create-user-handler';
import { deleteUserByIdHandler } from './handlers/delete-user-by-id.handler';
import { getUsersHandler } from './handlers/get-users.handler';

export const userRouter = Router();

userRouter.get(
  APP_ROUTES.ROOT,
  basicAuthMiddleware,
  usersInputQueryMiddleware,
  checkValidationMiddleware,
  getUsersHandler
);

userRouter.post(
  APP_ROUTES.ROOT,
  basicAuthMiddleware,
  userInputModelMiddleware,
  checkValidationMiddleware,
  createUserHandler
);

userRouter.delete(
  APP_ROUTES.ID,
  basicAuthMiddleware,
  idUriParamMiddleware,
  checkValidationMiddleware,
  deleteUserByIdHandler
);
