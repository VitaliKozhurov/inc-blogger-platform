import { Response } from 'express';

import { HTTP_STATUSES, RequestWithBodyType } from '../../../core/types';
import { authService } from '../../application';
import { RegistrationEmailResendingType } from '../../types';

export const registrationEmailResendingHandler = async (
  req: RequestWithBodyType<RegistrationEmailResendingType>,
  res: Response
) => {
  const result = await authService.registrationEmailResending(req.body);

  if (result.status !== HTTP_STATUSES.OK) {
    return res.status(HTTP_STATUSES.BAD_REQUEST).send({ errorsMessages: result.extensions });
  }

  res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
