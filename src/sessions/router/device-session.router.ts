import { Router } from 'express';

import { refreshTokenMiddleware } from '../../auth/middleware';
import { authRouter } from '../../auth/router/auth.router';
import { APP_ROUTES } from '../../core/constants';

import { deleteDeviceSessionByIdHandler } from './handlers/delete-device-session-by-id.handler';
import { deleteDevicesSessionsHandler } from './handlers/delete-devices-sessions';
import { getDevicesSessionsHandler } from './handlers/get-devices-sessions.handler';

export const deviceSessionRouter = Router();

authRouter.get(APP_ROUTES.SECURITY_DEVICES, refreshTokenMiddleware, getDevicesSessionsHandler);

authRouter.delete(
  APP_ROUTES.SECURITY_DEVICES,
  refreshTokenMiddleware,
  deleteDevicesSessionsHandler
);

authRouter.delete(
  `${APP_ROUTES.SECURITY_DEVICES}${APP_ROUTES.ID}`,
  refreshTokenMiddleware,
  deleteDeviceSessionByIdHandler
);
