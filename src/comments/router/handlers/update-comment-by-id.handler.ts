import { Response } from 'express';

import { HTTP_STATUSES, IdParamType, RequestWithParamAndBodyType } from '../../../core/types';
import { RESULT_STATUSES, resultCodeToHttpException } from '../../../core/utils';
import { commentsService } from '../../application';
import { UpdateCommentInputType } from '../../types';

export const updateCommentByIdHandler = async (
  req: RequestWithParamAndBodyType<IdParamType, UpdateCommentInputType>,
  res: Response
) => {
  const userId = req.userId!;
  const commentId = req.params.id;
  const content = req.body.content;

  const result = await commentsService.updateCommentById({ userId, commentId, content });

  if (result.status !== RESULT_STATUSES.OK) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }

  return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
