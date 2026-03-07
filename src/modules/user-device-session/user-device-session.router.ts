import { Router } from 'express';

import { refreshTokenMiddleware } from '../../auth/middleware';
import { iocContainer } from '../../composition-root';
import { APP_ROUTES } from '../../core/constants';

import { UserDeviceSessionsController } from './user-device-sessions.controller';

const userDeviceSessionsController = iocContainer.get(UserDeviceSessionsController);

export const userDeviceSessionRouter = Router();

userDeviceSessionRouter.get(
  APP_ROUTES.SECURITY_DEVICES,
  refreshTokenMiddleware,
  userDeviceSessionsController.getSessions.bind(userDeviceSessionsController)
);

userDeviceSessionRouter.delete(
  APP_ROUTES.SECURITY_DEVICES,
  refreshTokenMiddleware,
  userDeviceSessionsController.deleteSessionsExceptTheCurrent.bind(userDeviceSessionsController)
);

userDeviceSessionRouter.delete(
  `${APP_ROUTES.SECURITY_DEVICES}${APP_ROUTES.ID}`,
  refreshTokenMiddleware,
  userDeviceSessionsController.deleteSessionByDeviceId.bind(userDeviceSessionsController)
);
