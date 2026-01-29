import { Response } from 'express';

import { HTTP_STATUSES, RequestWithBodyType } from '../../../core/types';
import { RegistrationConfirmationInputType } from '../../types/auth.input';

export const registrationConfirmationHandler = (
  req: RequestWithBodyType<RegistrationConfirmationInputType>,
  res: Response
) => {
  res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
