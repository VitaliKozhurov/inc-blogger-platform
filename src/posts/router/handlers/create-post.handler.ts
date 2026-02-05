import { Response } from 'express';

import { HTTP_STATUSES, RequestWithBodyType } from '../../../core/types';
import { RESULT_STATUSES, resultCodeToHttpException } from '../../../core/utils';
import { postsService } from '../../application';
import { postsQWRepository } from '../../repository';
import { CreatePostInputType } from '../../types';

export const createPostHandler = async (
  req: RequestWithBodyType<CreatePostInputType>,
  res: Response
) => {
  const result = await postsService.createPost(req.body);

  if (result.status !== RESULT_STATUSES.OK) {
    return res.status(resultCodeToHttpException(result.status));
  }

  const createdPostViewModel = await postsQWRepository.getPostById(result.data!.id);

  return res.status(HTTP_STATUSES.CREATED).send(createdPostViewModel);
};
