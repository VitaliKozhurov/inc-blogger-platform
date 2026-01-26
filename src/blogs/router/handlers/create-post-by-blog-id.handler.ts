import { Response } from 'express';

import { HTTP_STATUSES, RequestWithParamAndBodyType } from '../../../core/types';
import { postsService } from '../../../posts/application';
import { postsQWRepository } from '../../../posts/repository';
import { CreatePostInputType } from '../../../posts/types';

export const createPostByBlogIdHandler = async (
  req: RequestWithParamAndBodyType<{ id: string }, Omit<CreatePostInputType, 'blogId'>>,
  res: Response
) => {
  const blogId = req.params.id;

  const result = await postsService.createPostForBlogById({ blogId, postData: req.body });

  if (result.status !== HTTP_STATUSES.OK) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  const createdPostViewModel = await postsQWRepository.getPostById(result.data!.id);

  res.status(HTTP_STATUSES.CREATED).send(createdPostViewModel);
};
