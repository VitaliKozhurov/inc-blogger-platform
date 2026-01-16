import { Response } from 'express';
import { matchedData } from 'express-validator';

import { HTTP_STATUSES } from '../../../core/constants';
import { IdParamType, RequestWithParamAndQueryType } from '../../../core/types/util-types';
import { postService } from '../../../posts/application';
import { mapToPostListViewModel } from '../../../posts/router/mappers/map-to-post-list-view-model';
import { PostRequestQueryType } from '../../../posts/types';

export const getPostsByBlogIdHandler = async (
  req: RequestWithParamAndQueryType<IdParamType, PostRequestQueryType>,
  res: Response
) => {
  try {
    const blogId = req.params.id;

    const query = matchedData<PostRequestQueryType>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const { items, totalCount } = await postService.getPostByBlogId({ blogId, query });

    const postsViewMode = mapToPostListViewModel({
      items,
      totalCount,
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
    });

    return res.status(HTTP_STATUSES.OK).send(postsViewMode);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
