import { Request, Response } from 'express';

import { authTokenAdapter } from '../../../auth/adapters';
import { HTTP_STATUSES } from '../../../core/types';
import { userSessionQWRepository } from '../../repository';

export const getDevicesSessionsHandler = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const decodedRefreshToken = authTokenAdapter.decodeRefreshToken(refreshToken)!;

  const usersSessionsViewModel = await userSessionQWRepository.getUserSessionsForUserById(
    decodedRefreshToken.userId
  );

  res.status(HTTP_STATUSES.OK).send(usersSessionsViewModel);
};
