import { Request, Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { blogRepository } from '../../repository/blog.repository';

export const getBlogsHandler = (_: Request, res: Response) => {
  const blogs = blogRepository.getBlogs();

  res.status(HTTP_STATUSES.OK).send(blogs);
};
