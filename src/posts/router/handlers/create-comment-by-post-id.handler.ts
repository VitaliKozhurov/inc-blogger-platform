import { Response } from 'express';

import { commentsService } from '../../../comments/application';
import { commentsQWRepository } from '../../../comments/repository';
import { CreateCommentInputType } from '../../../comments/types';
import { HTTP_STATUSES, IdParamType, RequestWithParamAndBodyType } from '../../../core/types';

export const createCommentByPostIdHandler = async (
  req: RequestWithParamAndBodyType<IdParamType, CreateCommentInputType>,
  res: Response
) => {
  const userId = req.userId;

  if (!userId) {
    return res.sendStatus(HTTP_STATUSES.BAD_REQUEST);
  }

  const result = await commentsService.createCommentByPostId({
    postId: req.params.id,
    userId,
    content: req.body.content,
  });

  if (result.status !== HTTP_STATUSES.OK) {
    return res.sendStatus(result.status);
  }

  const createdCommentViewModel = await commentsQWRepository.getCommentById(result.data!.commentId);

  return res.status(HTTP_STATUSES.CREATED).send(createdCommentViewModel);
};
