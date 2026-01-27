import { Response } from 'express';

import { HTTP_STATUSES, RequestWithUriParamType } from '../../../core/types';
import { commentsService } from '../../application';
import { commentsQWRepository } from '../../repository';

export const deleteCommentByIdHandler = async (req: RequestWithUriParamType, res: Response) => {
  const userId = req.userId;

  const comment = await commentsQWRepository.getCommentById(req.params.id);

  if (!comment) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  if (comment.commentatorInfo.userId !== userId) {
    return res.sendStatus(HTTP_STATUSES.FORBIDDEN);
  }

  const isDeleted = await commentsService.deleteCommentById(req.params.id);

  if (!isDeleted) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
