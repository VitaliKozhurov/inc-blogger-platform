import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUSES } from '../../core/types';
import { userSessionRepository } from '../../sessions/repository';
import { authTokenAdapter } from '../adapters';

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken as string;

  if (!refreshToken) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
  }

  const result = authTokenAdapter.verifyRefreshToken(refreshToken);

  if (!result.success) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
  }

  const tokenSession = await userSessionRepository.getUserSessionsByDeviceId(
    result.payload.deviceId
  );

  if (!tokenSession || tokenSession.iat !== result.payload.iat) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
  }

  next();
};
