import { Response } from 'express';
import { matchedData } from 'express-validator';

import { errorsHandler } from '../../../core/errors';
import { HTTP_STATUSES, RequestWithQueryType } from '../../../core/types';
import { postsQWRepository } from '../../repository';
import { PostsRequestQueryType } from '../../types';

export const getPostsHandler = async (
  req: RequestWithQueryType<PostsRequestQueryType>,
  res: Response
) => {
  try {
    const query = matchedData<PostsRequestQueryType>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const postsViewModels = await postsQWRepository.getPosts(query);

    res.status(HTTP_STATUSES.OK).send(postsViewModels);
  } catch (e) {
    errorsHandler(e, res);
  }
};
