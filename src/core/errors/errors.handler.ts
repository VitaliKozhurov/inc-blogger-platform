import { Response } from 'express';

import { HTTP_STATUSES } from '../types';

import { RepositoryNotFoundError } from './repository-not-found-error';
import { UnAuthorizedError } from './unauthorized-error';

export const errorsHandler = (e: unknown, res: Response) => {
  if (e instanceof UnAuthorizedError) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
  }

  if (e instanceof RepositoryNotFoundError) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
};
