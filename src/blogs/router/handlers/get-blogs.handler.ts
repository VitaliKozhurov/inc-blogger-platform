import { Request, Response } from 'express';

import { blogRepository } from '../../repository';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model';

import { HTTP_STATUSES } from '@/core/constants';

export const getBlogsHandler = async (_: Request, res: Response) => {
  try {
    const blogs = await blogRepository.getBlogs();

    const blogViewModels = blogs.map(mapToBlogViewModel);

    res.status(HTTP_STATUSES.OK).send(blogViewModels);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
