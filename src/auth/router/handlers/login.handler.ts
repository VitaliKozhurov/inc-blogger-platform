import { Response } from 'express';

import { HTTP_STATUSES, RequestWithBodyType } from '../../../core/types';
import { getRequestIp, RESULT_STATUSES, resultCodeToHttpException } from '../../../core/utils';
import { authService } from '../../application';
import { LoginInputType } from '../../types';

const FALLBACK_DEVICE_NAME = 'Unknown Device';

export const loginHandler = async (req: RequestWithBodyType<LoginInputType>, res: Response) => {
  const deviceName = req.headers['user-agent'] ?? FALLBACK_DEVICE_NAME;
  const ip = getRequestIp(req);

  const result = await authService.login({ ip, deviceName, credentials: req.body });

  if (result.status !== RESULT_STATUSES.OK) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send({ errorsMessages: result.extensions });
  }

  res.cookie('refreshToken', result.data?.refreshToken, { httpOnly: true, secure: true });
  res.status(HTTP_STATUSES.OK).send({ accessToken: result.data!.accessToken });
};
