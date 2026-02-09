import { Request, Response } from 'express';

import { HTTP_STATUSES } from '../../../core/types';
import { userSessionQWRepository } from '../../repository';

export const getDevicesSessionsHandler = async (_: Request, res: Response) => {
  const usersSessionsViewModel = await userSessionQWRepository.getUserSessions();

  res.status(HTTP_STATUSES.OK).send(usersSessionsViewModel);
};
