import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUSES } from '../../core/types';
import { jwtAdapter } from '../adapters';

export const accessTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
  }

  const [authType, token] = authToken.split(' ');

  if (authType !== 'Bearer') {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
  }

  const payload = jwtAdapter.verifyJWT(token);

  if (!payload) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
  }

  req.userId = payload.userId;

  next();
};
