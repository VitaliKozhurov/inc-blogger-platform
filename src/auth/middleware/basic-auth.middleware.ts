import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUSES } from '../../core/types';

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization;

  if (!authToken || authToken !== process.env.AUTH_TOKEN) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
  }

  next();
};
