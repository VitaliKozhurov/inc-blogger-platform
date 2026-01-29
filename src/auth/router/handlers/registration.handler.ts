import { Response } from 'express';

import { HTTP_STATUSES, RequestWithBodyType } from '../../../core/types';
import { RegistrationInputType } from '../../types/auth.input';

export const registrationHandler = (
  req: RequestWithBodyType<RegistrationInputType>,
  res: Response
) => {
  res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
