import { Response } from 'express';

import { HTTP_STATUSES, RequestWithUriParamType } from '../../../core/types';
import { RESULT_STATUSES, resultCodeToHttpException } from '../../../core/utils';
import { commentsService } from '../../application';

export const deleteCommentByIdHandler = async (req: RequestWithUriParamType, res: Response) => {
  const userId = req.userId!;
  const commentId = req.params.id;

  const result = await commentsService.deleteCommentById({ userId, commentId });

  if (result.status !== RESULT_STATUSES.OK) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }

  return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
