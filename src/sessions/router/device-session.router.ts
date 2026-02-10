import { Router } from 'express';

import { refreshTokenMiddleware } from '../../auth/middleware';
import { APP_ROUTES } from '../../core/constants';

import { deleteDeviceSessionByIdHandler } from './handlers/delete-device-session-by-id.handler';
import { deleteDevicesSessionsHandler } from './handlers/delete-devices-sessions';
import { getDevicesSessionsHandler } from './handlers/get-devices-sessions.handler';

export const deviceSessionRouter = Router();

deviceSessionRouter.get(
  APP_ROUTES.SECURITY_DEVICES,
  refreshTokenMiddleware,
  getDevicesSessionsHandler
);

deviceSessionRouter.delete(
  APP_ROUTES.SECURITY_DEVICES,
  refreshTokenMiddleware,
  deleteDevicesSessionsHandler
);

deviceSessionRouter.delete(
  `${APP_ROUTES.SECURITY_DEVICES}${APP_ROUTES.ID}`,
  refreshTokenMiddleware,
  deleteDeviceSessionByIdHandler
);
