import { Response } from 'express';

import { HTTP_STATUSES, RequestWithBodyType } from '../../../core/types';
import { authService } from '../../application';
import { LoginInputType } from '../../types';

export const loginHandler = async (req: RequestWithBodyType<LoginInputType>, res: Response) => {
  const result = await authService.login(req.body);

  if (result.status !== HTTP_STATUSES.OK) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
  }

  res.status(HTTP_STATUSES.OK).send({ accessToken: result.data!.accessToken });
};
