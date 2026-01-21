import { Response } from 'express';
import { matchedData } from 'express-validator';

import { HTTP_STATUSES } from '../../../core/constants';
import { errorsHandler } from '../../../core/errors';
import { IdParamType, RequestWithParamAndQueryType } from '../../../core/types';
import { postsQWRepository } from '../../../posts/repository';
import { mapToPostListViewModel } from '../../../posts/router/mappers';
import { PostRequestQueryType } from '../../../posts/types';
import { blogsQWRepository } from '../../repository';

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

    await blogsQWRepository.getBlogByIdOrFail(blogId);

    const { items, totalCount } = await postsQWRepository.getPostsByBlogId({ blogId, query });

    const postsViewMode = mapToPostListViewModel({
      items,
      totalCount,
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
    });

    return res.status(HTTP_STATUSES.OK).send(postsViewMode);
  } catch (e) {
    errorsHandler(e, res);
  }
};
