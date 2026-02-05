import { Response } from 'express';

import { commentsService } from '../../../comments/application';
import { commentsQWRepository } from '../../../comments/repository';
import { CreateCommentInputType } from '../../../comments/types';
import { HTTP_STATUSES, IdParamType, RequestWithParamAndBodyType } from '../../../core/types';
import { RESULT_STATUSES } from '../../../core/utils';

export const createCommentByPostIdHandler = async (
  req: RequestWithParamAndBodyType<IdParamType, CreateCommentInputType>,
  res: Response
) => {
  const userId = req.userId!;

  const result = await commentsService.createCommentByPostId({
    postId: req.params.id,
    userId: userId,
    content: req.body.content,
  });

  if (result.status !== RESULT_STATUSES.OK) {
    return res.sendStatus(result.status);
  }

  const createdCommentViewModel = await commentsQWRepository.getCommentById(result.data!.commentId);

  return res.status(HTTP_STATUSES.CREATED).send(createdCommentViewModel);
};
