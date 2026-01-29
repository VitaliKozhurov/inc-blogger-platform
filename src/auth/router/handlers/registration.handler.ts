import { Response } from 'express';

import { HTTP_STATUSES, RequestWithBodyType } from '../../../core/types';
import { authService } from '../../application';
import { RegistrationInputType } from '../../types/auth.input';

export const registrationHandler = async (
  req: RequestWithBodyType<RegistrationInputType>,
  res: Response
) => {
  const result = await authService.register(req.body);

  if (result.status !== HTTP_STATUSES.OK) {
    return res.status(HTTP_STATUSES.BAD_REQUEST).send({ errorsMessages: result.extensions });
  }

  res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
