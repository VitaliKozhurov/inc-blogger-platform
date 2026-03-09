import { NextFunction, Request, Response } from 'express';

import { iocContainer } from '../../../composition-root';
import { HTTP_STATUSES } from '../../../core/types';
import { AuthTokenAdapter } from '../adapters/auth-token.adapter';

const authTokenAdapter = iocContainer.get(AuthTokenAdapter);

export const accessTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
  }

  const [authType, token] = authToken.split(' ');

  if (authType !== 'Bearer') {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
  }

  const result = authTokenAdapter.verifyAccessToken(token);

  if (!result.success) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
  }

  req.userId = result.payload.userId;
  req.login = result.payload.login;

  next();
};
