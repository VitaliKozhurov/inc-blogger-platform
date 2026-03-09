import { Router } from 'express';

import { iocContainer } from '../../composition-root';
import { APP_ROUTES } from '../../core/constants';
import { checkValidationMiddleware, idUriParamMiddleware } from '../../core/middleware';
import { basicAuthMiddleware } from '../auth/middleware/basic-auth.middleware';

import { userInputModelMiddleware } from './middleware/user-input-model.middleware';
import { usersInputQueryMiddleware } from './middleware/users-input-query.middleware';
import { UsersController } from './users.controller';

export const usersRouter = Router();

const usersController = iocContainer.get(UsersController);

usersRouter.get(
  APP_ROUTES.ROOT,
  basicAuthMiddleware,
  usersInputQueryMiddleware,
  checkValidationMiddleware,
  usersController.getUsers.bind(usersController)
);

usersRouter.post(
  APP_ROUTES.ROOT,
  basicAuthMiddleware,
  userInputModelMiddleware,
  checkValidationMiddleware,
  usersController.createUser.bind(usersController)
);

usersRouter.delete(
  APP_ROUTES.ID,
  basicAuthMiddleware,
  idUriParamMiddleware,
  checkValidationMiddleware,
  usersController.deleteUserById.bind(usersController)
);
