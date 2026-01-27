import { Response } from 'express';
import { matchedData } from 'express-validator';

import { commentsQWRepository } from '../../../comments/repository';
import { CommentsRequestQueryType } from '../../../comments/types';
import { HTTP_STATUSES, IdParamType, RequestWithParamAndQueryType } from '../../../core/types';

export const getCommentsByPostIdHandler = async (
  req: RequestWithParamAndQueryType<IdParamType, Record<string, string>>,
  res: Response
) => {
  const postId = req.params.id;

  const query = matchedData<CommentsRequestQueryType>(req, {
    locations: ['query'],
    includeOptionals: true,
  });

  const comment = await commentsQWRepository.getCommentById(postId);

  if (!comment) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  const commentsViewMode = await commentsQWRepository.getComments({ blogId, query });

  return res.status(HTTP_STATUSES.OK).send(postsViewMode);
};
