import { Request, Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { blogsService } from '../../application';
import { BlogRequestQueryType } from '../../types';
import { mapToBlogListViewModel } from '../mappers/map-to-blog-list-view-model';

export const getBlogsHandler = async (req: Request<BlogRequestQueryType>, res: Response) => {
  try {
    const queryParams: BlogRequestQueryType = req.params;

    const { items, totalCount } = await blogsService.getBlogs(queryParams);

    const blogViewModels = mapToBlogListViewModel({
      pageSize: queryParams.pageSize,
      pageNumber: queryParams.pageNumber,
      items,
      totalCount,
    });

    res.status(HTTP_STATUSES.OK).send(blogViewModels);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
