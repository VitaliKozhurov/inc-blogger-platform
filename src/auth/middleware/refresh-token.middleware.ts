import { NextFunction, Request, Response } from 'express';

import { iocContainer } from '../../composition-root';
import { HTTP_STATUSES } from '../../core/types';
import { UserDeviceSessionsRepository } from '../../sessions/repository';
import { AuthTokenAdapter } from '../adapters';

const authTokenAdapter = iocContainer.get(AuthTokenAdapter);
const userDeviceSessionsRepository = iocContainer.get(UserDeviceSessionsRepository);

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken as string;

  if (!refreshToken) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
  }

  const result = authTokenAdapter.verifyRefreshToken(refreshToken);

  if (!result.success) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
  }

  const tokenSession = await userDeviceSessionsRepository.getSessionByFilter({
    deviceId: result.payload.deviceId,
  });

  if (
    !tokenSession ||
    tokenSession.iat.toISOString() !== new Date(result.payload.iat).toISOString()
  ) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
  }

  next();
};
