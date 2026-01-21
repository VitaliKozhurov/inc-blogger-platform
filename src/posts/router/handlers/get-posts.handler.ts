import { Response } from 'express';
import { matchedData } from 'express-validator';

import { HTTP_STATUSES } from '../../../core/constants';
import { errorsHandler } from '../../../core/errors';
import { RequestWithQueryType } from '../../../core/types';
import { postsQWRepository } from '../../repository';
import { PostRequestQueryType } from '../../types';
import { mapToPostListViewModel } from '../mappers';

export const getPostsHandler = async (
  req: RequestWithQueryType<PostRequestQueryType>,
  res: Response
) => {
  try {
    const query = matchedData<PostRequestQueryType>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const { items, totalCount } = await postsQWRepository.getPosts(query);

    const postsViewModels = mapToPostListViewModel({
      pageSize: query.pageSize,
      pageNumber: query.pageNumber,
      items,
      totalCount,
    });

    res.status(HTTP_STATUSES.OK).send(postsViewModels);
  } catch (e) {
    errorsHandler(e, res);
  }
};
