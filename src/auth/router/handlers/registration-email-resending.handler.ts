import { Response } from 'express';

import { HTTP_STATUSES, RequestWithBodyType } from '../../../core/types';
import { RegistrationEmailResendingType } from '../../types';

export const registrationEmailResendingHandler = (
  req: RequestWithBodyType<RegistrationEmailResendingType>,
  res: Response
) => {
  res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
