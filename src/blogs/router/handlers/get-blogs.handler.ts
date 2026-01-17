import { Response } from 'express';
import { matchedData } from 'express-validator';

import { HTTP_STATUSES } from '../../../core/constants';
import { errorsHandler } from '../../../core/errors';
import { RequestWithQueryType } from '../../../core/types/util-types';
import { blogsService } from '../../application';
import { BlogRequestQueryType } from '../../types';
import { mapToBlogListViewModel } from '../mappers/map-to-blog-list-view-model';

export const getBlogsHandler = async (
  req: RequestWithQueryType<BlogRequestQueryType>,
  res: Response
) => {
  try {
    const query = matchedData<BlogRequestQueryType>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    // !! TODO check this case
    // const queryInput = setDefaultSortAndPaginationIfNotExist(query);

    const { items, totalCount } = await blogsService.getBlogs(query);

    const blogViewModels = mapToBlogListViewModel({
      pageSize: query.pageSize,
      pageNumber: query.pageNumber,
      items,
      totalCount,
    });

    res.status(HTTP_STATUSES.OK).send(blogViewModels);
  } catch (e) {
    errorsHandler(e, res);
  }
};
