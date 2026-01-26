import { Response } from 'express';

import { HTTP_STATUSES, RequestWithBodyType } from '../../../core/types';
import { postsService } from '../../application';
import { postsQWRepository } from '../../repository';
import { CreatePostInputType } from '../../types';

export const createPostHandler = async (
  req: RequestWithBodyType<CreatePostInputType>,
  res: Response
) => {
  const result = await postsService.createPost(req.body);

  if (result.status !== HTTP_STATUSES.OK) {
    return res.status(HTTP_STATUSES.NOT_FOUND).send({ errorsMessages: result.extensions });
  }

  const createdPostViewModel = await postsQWRepository.getPostById(result.data!.id);

  if (!createdPostViewModel) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  return res.status(HTTP_STATUSES.CREATED).send(createdPostViewModel);
};
