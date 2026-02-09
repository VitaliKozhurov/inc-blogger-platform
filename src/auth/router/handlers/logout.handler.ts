import { Response } from 'express';

import { HTTP_STATUSES, RequestWithBodyType } from '../../../core/types';
import { userSessionService } from '../../application/user-session.service';
import { LoginInputType } from '../../types';

export const logoutHandler = async (req: RequestWithBodyType<LoginInputType>, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  await userSessionService.deleteUserSession(refreshToken);

  res.clearCookie('refreshToken', { path: '/' });
  res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
