import { Response } from 'express';

import { HTTP_STATUSES, RequestWithBodyType } from '../../../core/types';
import { RESULT_STATUSES, resultCodeToHttpException } from '../../../core/utils';
import { authService } from '../../application';
import { RegistrationInputType } from '../../types/auth.input';

export const registrationHandler = async (
  req: RequestWithBodyType<RegistrationInputType>,
  res: Response
) => {
  const result = await authService.registration(req.body);

  if (result.status !== RESULT_STATUSES.OK) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send({ errorsMessages: result.extensions });
  }

  res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
