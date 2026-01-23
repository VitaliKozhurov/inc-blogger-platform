import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { errorsHandler } from '../../../core/errors';
import { RequestWithBodyType } from '../../../core/types';
import { authService } from '../../application';
import { LoginInputType } from '../../types';

export const loginHandler = async (req: RequestWithBodyType<LoginInputType>, res: Response) => {
  try {
    await authService.login(req.body);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  } catch (e) {
    errorsHandler(e, res);
  }
};
