import { Response } from 'express';

import { HTTP_STATUSES, RequestWithBodyType } from '../../../core/types';
import { authService } from '../../application';
import { RegistrationConfirmationInputType } from '../../types/auth.input';

export const registrationConfirmationHandler = async (
  req: RequestWithBodyType<RegistrationConfirmationInputType>,
  res: Response
) => {
  const result = await authService.registrationConfirmation(req.body.code);

  if (result.status !== HTTP_STATUSES.OK) {
    return res.status(HTTP_STATUSES.BAD_REQUEST).send({ errorsMessages: result.extensions });
  }

  res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
