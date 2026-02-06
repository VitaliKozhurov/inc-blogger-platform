import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUSES } from '../../core/types';
import { authTokenAdapter } from '../adapters';
import { refreshTokenRepository } from '../repository';

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken as string;

  if (!refreshToken) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
  }

  const result = authTokenAdapter.verifyRefreshToken(refreshToken);

  if (!result.success) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
  }

  const revokedToken = await refreshTokenRepository.getRevokedToken(refreshToken);

  if (revokedToken) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
  }

  next();
};
