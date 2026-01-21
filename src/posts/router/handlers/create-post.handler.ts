import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { errorsHandler } from '../../../core/errors';
import { RequestWithBodyType } from '../../../core/types';
import { postsService } from '../../application';
import { postsQWRepository } from '../../repository';
import { CreatePostInputType } from '../../types';
import { mapToPostViewModel } from '../mappers';

export const createPostHandler = async (
  req: RequestWithBodyType<CreatePostInputType>,
  res: Response
) => {
  try {
    // TODO что если пост создался но запрос за постом не прошел

    const postId = await postsService.createPost(req.body);

    const createdPost = await postsQWRepository.getPostByIdOrFail(postId);

    const createdPostViewModel = mapToPostViewModel(createdPost);

    return res.status(HTTP_STATUSES.CREATED).send(createdPostViewModel);
  } catch (e) {
    errorsHandler(e, res);
  }
};
