import { Response } from 'express';

import { errorsHandler } from '../../../core/errors';
import { RequestWithBodyType } from '../../../core/types';
import { LoginInputType } from '../../types';

export const loginHandler = (req: RequestWithBodyType<LoginInputType>, res: Response) => {
  try {
    console.log(req.body);
  } catch (e) {
    errorsHandler(e, res);
  }
};
