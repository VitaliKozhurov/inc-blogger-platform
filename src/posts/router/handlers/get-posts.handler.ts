import { Request, Response } from 'express';
import { matchedData } from 'express-validator';

import { HTTP_STATUSES } from '../../../core/types';
import { postsQWRepository } from '../../repository';
import { PostsRequestQueryType } from '../../types';

export const getPostsHandler = async (req: Request, res: Response) => {
  const query = matchedData<PostsRequestQueryType>(req, {
    locations: ['query'],
    includeOptionals: true,
  });

  const postsViewModels = await postsQWRepository.getPosts(query);

  res.status(HTTP_STATUSES.OK).send(postsViewModels);
};
