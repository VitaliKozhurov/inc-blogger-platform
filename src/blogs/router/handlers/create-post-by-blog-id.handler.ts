import { Response } from 'express';

import { HTTP_STATUSES, IdParamType, RequestWithParamAndBodyType } from '../../../core/types';
import { RESULT_STATUSES, resultCodeToHttpException } from '../../../core/utils';
import { postsService } from '../../../posts/application';
import { postsQWRepository } from '../../../posts/repository';
import { CreatePostInputType } from '../../../posts/types';

export const createPostByBlogIdHandler = async (
  req: RequestWithParamAndBodyType<IdParamType, Omit<CreatePostInputType, 'blogId'>>,
  res: Response
) => {
  const blogId = req.params.id;

  const result = await postsService.createPost({ blogId, ...req.body });

  if (result.status !== RESULT_STATUSES.OK) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }

  const createdPostViewModel = await postsQWRepository.getPostById(result.data!.id);

  res.status(HTTP_STATUSES.CREATED).send(createdPostViewModel);
};
