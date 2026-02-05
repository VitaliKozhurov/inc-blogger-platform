import { Response } from 'express';

import { HTTP_STATUSES, RequestWithUriParamType } from '../../../core/types';
import { RESULT_STATUSES, resultCodeToHttpException } from '../../../core/utils';
import { postsService } from '../../application';

export const deletePostByIdHandler = async (req: RequestWithUriParamType, res: Response) => {
  const result = await postsService.deletePostById(req.params.id);

  if (result.status !== RESULT_STATUSES.OK) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }

  return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
