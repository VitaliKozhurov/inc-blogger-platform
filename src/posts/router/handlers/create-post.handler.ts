import { Response } from 'express';


import { errorsHandler } from '../../../core/errors';
import { HTTP_STATUSES, RequestWithBodyType } from '../../../core/types';
import { postsService } from '../../application';
import { postsQWRepository } from '../../repository';
import { CreatePostInputType } from '../../types';

export const createPostHandler = async (
  req: RequestWithBodyType<CreatePostInputType>,
  res: Response
) => {
  try {
    const postId = await postsService.createPost(req.body);

    const createdPostViewModel = await postsQWRepository.getPostByIdOrFail(postId);

    return res.status(HTTP_STATUSES.CREATED).send(createdPostViewModel);
  } catch (e) {
    errorsHandler(e, res);
  }
};
