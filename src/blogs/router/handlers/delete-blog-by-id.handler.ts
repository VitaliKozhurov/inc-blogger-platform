import { Response } from 'express';

import { HTTP_STATUSES, RequestWithUriParamType } from '../../../core/types';
import { RESULT_STATUSES, resultCodeToHttpException } from '../../../core/utils';
import { blogsService } from '../../application';

export const deleteBlogByIdHandler = async (req: RequestWithUriParamType, res: Response) => {
  const result = await blogsService.deleteBlogById(req.params.id);

  if (result.status !== RESULT_STATUSES.OK) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }

  return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
