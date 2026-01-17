import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { errorsHandler } from '../../../core/errors';
import { RequestWithParamAndBodyType } from '../../../core/types';
import { postService } from '../../../posts/application';
import { mapToPostViewModel } from '../../../posts/router/mappers/map-to-post-view-model';
import { CreatePostInputType } from '../../../posts/types';

export const createPostByBlogIdHandler = async (
  req: RequestWithParamAndBodyType<{ id: string }, Omit<CreatePostInputType, 'blogId'>>,
  res: Response
) => {
  try {
    // TODO что если пост создался но запрос за постом не прошел

    const blogId = req.params.id;

    const postId = await postService.createPost({ blogId, ...req.body });

    const createdPost = await postService.getPostById(postId);

    const createdPostViewModel = mapToPostViewModel(createdPost);

    res.status(HTTP_STATUSES.CREATED).send(createdPostViewModel);
  } catch (e) {
    errorsHandler(e, res);
  }
};
