import { Response } from 'express';
import { matchedData } from 'express-validator';

import { HTTP_STATUSES } from '../../../core/constants';
import { RequestWithQueryType } from '../../../core/types/util-types';
import { blogsService } from '../../application';
import { BlogRequestQueryType } from '../../types';
import { mapToBlogListViewModel } from '../mappers/map-to-blog-list-view-model';

export const getBlogsHandler = async (
  req: RequestWithQueryType<BlogRequestQueryType>,
  res: Response
) => {
  try {
    const sanitizedQuery = matchedData<BlogRequestQueryType>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    // TODO check value
    console.log(req.query);

    // !! TODO check this case
    // const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

    const { items, totalCount } = await blogsService.getBlogs(sanitizedQuery);

    const blogViewModels = mapToBlogListViewModel({
      pageSize: sanitizedQuery.pageSize,
      pageNumber: sanitizedQuery.pageNumber,
      items,
      totalCount,
    });

    res.status(HTTP_STATUSES.OK).send(blogViewModels);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
