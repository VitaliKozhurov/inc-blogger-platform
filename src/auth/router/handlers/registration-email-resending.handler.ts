import { Response } from 'express';

import { HTTP_STATUSES, RequestWithBodyType } from '../../../core/types';
import { RESULT_STATUSES, resultCodeToHttpException } from '../../../core/utils';
import { authService } from '../../application';
import { RegistrationEmailResendingType } from '../../types';

export const registrationEmailResendingHandler = async (
  req: RequestWithBodyType<RegistrationEmailResendingType>,
  res: Response
) => {
  const result = await authService.registrationEmailResending(req.body);

  if (result.status !== RESULT_STATUSES.OK) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send({ errorsMessages: result.extensions });
  }

  res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
