import { Response } from 'express';

import { HTTP_STATUSES, RequestWithUriParamType } from '../../../core/types';
import { RESULT_STATUSES, resultCodeToHttpException } from '../../../core/utils';
import { userSessionService } from '../../application';

export const deleteDeviceSessionByIdHandler = async (
  req: RequestWithUriParamType,
  res: Response
) => {
  const deviceId = req.params.id;
  const refreshToken = req.cookies.refreshToken;

  const result = await userSessionService.deleteUserSessionByDeviceId({
    deviceId,
    refreshToken,
  });

  if (result.status !== RESULT_STATUSES.OK) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send({ errorsMessages: result.extensions });
  }

  res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
