import { Router } from 'express';

import { refreshTokenMiddleware } from '../../auth/middleware';
import { iocContainer } from '../../composition-root';
import { APP_ROUTES } from '../../core/constants';
import { UserDeviceSessionsController } from '../controller';

const userDeviceSessionsController = iocContainer.get(UserDeviceSessionsController);

export const deviceSessionRouter = Router();

deviceSessionRouter.get(
  APP_ROUTES.SECURITY_DEVICES,
  refreshTokenMiddleware,
  userDeviceSessionsController.getSessions.bind(userDeviceSessionsController)
);

deviceSessionRouter.delete(
  APP_ROUTES.SECURITY_DEVICES,
  refreshTokenMiddleware,
  userDeviceSessionsController.deleteSessionsExceptTheCurrent.bind(userDeviceSessionsController)
);

deviceSessionRouter.delete(
  `${APP_ROUTES.SECURITY_DEVICES}${APP_ROUTES.ID}`,
  refreshTokenMiddleware,
  userDeviceSessionsController.deleteSessionByDeviceId.bind(userDeviceSessionsController)
);
