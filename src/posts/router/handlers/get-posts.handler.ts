import { Response } from 'express';
import { matchedData } from 'express-validator';

import { HTTP_STATUSES } from '../../../core/constants';
import { RequestWithQueryType } from '../../../core/types';
import { postService } from '../../application';
import { PostRequestQueryType } from '../../types';
import { mapToPostListViewModel } from '../mappers/map-to-post-list-view-model';

export const getPostsHandler = async (
  req: RequestWithQueryType<PostRequestQueryType>,
  res: Response
) => {
  try {
    const query = matchedData<PostRequestQueryType>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const { items, totalCount } = await postService.getPosts(query);

    const postsViewModels = mapToPostListViewModel({
      pageSize: query.pageSize,
      pageNumber: query.pageNumber,
      items,
      totalCount,
    });

    res.status(HTTP_STATUSES.OK).send(postsViewModels);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
