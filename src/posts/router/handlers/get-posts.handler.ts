import { Request, Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { postRepository } from '../../repository';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model';

export const getPostsHandler = async (_: Request, res: Response) => {
  try {
    const posts = await postRepository.getPosts();

    const postViewModels = posts.map(mapToPostViewModel);

    res.status(HTTP_STATUSES.OK).send(postViewModels);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
