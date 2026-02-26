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
  userDeviceSessionsController.getDeviceSessions.bind(userDeviceSessionsController)
);

deviceSessionRouter.delete(
  APP_ROUTES.SECURITY_DEVICES,
  refreshTokenMiddleware,
  userDeviceSessionsController.deleteDevicesSessions.bind(userDeviceSessionsController)
);

deviceSessionRouter.delete(
  `${APP_ROUTES.SECURITY_DEVICES}${APP_ROUTES.ID}`,
  refreshTokenMiddleware,
  userDeviceSessionsController.deleteDeviceSessionById.bind(userDeviceSessionsController)
);
