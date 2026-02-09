import { Request, Response } from 'express';

import { HTTP_STATUSES } from '../../../core/types';
import { userSessionService } from '../../application';

export const deleteDevicesSessionsHandler = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string;

  await userSessionService.deleteUserSessionsExceptTheCurrent(refreshToken);

  res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
