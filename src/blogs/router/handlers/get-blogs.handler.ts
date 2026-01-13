import { Request, Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { blogRepository } from '../../repository';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model';

export const getBlogsHandler = async (_: Request, res: Response) => {
  try {
    const blogs = await blogRepository.getBlogs();

    const blogViewModels = blogs.map(mapToBlogViewModel);

    res.status(HTTP_STATUSES.OK).send(blogViewModels);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
