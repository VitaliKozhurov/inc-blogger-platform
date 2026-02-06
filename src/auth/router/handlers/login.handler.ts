import { Response } from 'express';

import { HTTP_STATUSES, RequestWithBodyType } from '../../../core/types';
import { RESULT_STATUSES, resultCodeToHttpException } from '../../../core/utils';
import { authService } from '../../application';
import { LoginInputType } from '../../types';

export const loginHandler = async (req: RequestWithBodyType<LoginInputType>, res: Response) => {
  const result = await authService.login(req.body);

  if (result.status !== RESULT_STATUSES.OK) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send({ errorsMessages: result.extensions });
  }

  res.cookie('refreshToken', result.data?.refreshToken, { httpOnly: true, secure: true });
  res.status(HTTP_STATUSES.OK).send({ accessToken: result.data!.accessToken });
};
