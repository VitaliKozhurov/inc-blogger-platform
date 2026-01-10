import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { IdParamType, RequestWithBodyAndParamType } from '../../../core/types';
import { postRepository } from '../../repository/post.repository';
import { PostInputModelType } from '../../types/post';

export const updatePostHandler = (
  req: RequestWithBodyAndParamType<IdParamType, PostInputModelType>,
  res: Response
) => {
  const isUpdated = postRepository.updatePostById({ id: req.params.id, body: req.body });

  if (isUpdated) {
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  }

  res.sendStatus(HTTP_STATUSES.NOT_FOUND);
};
