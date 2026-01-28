import { Response } from 'express';

import { HTTP_STATUSES, IdParamType, RequestWithParamAndBodyType } from '../../../core/types';
import { commentsService } from '../../application';
import { commentsQWRepository } from '../../repository';
import { UpdateCommentInputType } from '../../types';

export const updateCommentByIdHandler = async (
  req: RequestWithParamAndBodyType<IdParamType, UpdateCommentInputType>,
  res: Response
) => {
  const userId = req.userId;
  const commentId = req.params.id;

  const comment = await commentsQWRepository.getCommentById(commentId);

  if (!comment) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  if (comment.commentatorInfo.userId !== userId) {
    return res.sendStatus(HTTP_STATUSES.FORBIDDEN);
  }

  const isUpdated = await commentsService.updateCommentById({
    id: commentId,
    content: req.body.content,
  });

  if (!isUpdated) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
