import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { errorsHandler } from '../../../core/errors';
import { RequestWithParamAndBodyType } from '../../../core/types';
import { postsService } from '../../../posts/application';
import { postsQWRepository } from '../../../posts/repository';
import { mapToPostViewModel } from '../../../posts/router/mappers';
import { CreatePostInputType } from '../../../posts/types';

export const createPostByBlogIdHandler = async (
  req: RequestWithParamAndBodyType<{ id: string }, Omit<CreatePostInputType, 'blogId'>>,
  res: Response
) => {
  try {
    // TODO что если пост создался но запрос за постом не прошел

    const blogId = req.params.id;

    const postId = await postsService.createPostForBlogById({ blogId, postData: req.body });

    const createdPost = await postsQWRepository.getPostByIdOrFail(postId);

    const createdPostViewModel = mapToPostViewModel(createdPost);

    res.status(HTTP_STATUSES.CREATED).send(createdPostViewModel);
  } catch (e) {
    errorsHandler(e, res);
  }
};
