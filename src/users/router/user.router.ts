import { Router } from 'express';

import { basicAuthMiddleware } from '../../auth/middleware';
import { iocContainer } from '../../composition-root';
import { APP_ROUTES } from '../../core/constants';
import { checkValidationMiddleware, idUriParamMiddleware } from '../../core/middleware';
import { UsersController } from '../controller/users.controller';
import { userInputModelMiddleware, usersInputQueryMiddleware } from '../middleware';

export const userRouter = Router();

const usersController = iocContainer.get(UsersController);

userRouter.get(
  APP_ROUTES.ROOT,
  basicAuthMiddleware,
  usersInputQueryMiddleware,
  checkValidationMiddleware,
  usersController.getUsers.bind(usersController)
);

userRouter.post(
  APP_ROUTES.ROOT,
  basicAuthMiddleware,
  userInputModelMiddleware,
  checkValidationMiddleware,
  usersController.createUser.bind(usersController)
);

userRouter.delete(
  APP_ROUTES.ID,
  basicAuthMiddleware,
  idUriParamMiddleware,
  checkValidationMiddleware,
  usersController.deleteUserById.bind(usersController)
);
