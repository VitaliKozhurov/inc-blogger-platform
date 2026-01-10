import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { RequestWithBodyType } from '../../../core/types';
import { blogRepository } from '../../repository/blog.repository';
import { BlogInputModelType } from '../../types/blog';

export const createBlogHandler = (req: RequestWithBodyType<BlogInputModelType>, res: Response) => {
  const newPost = blogRepository.createBlog(req.body);

  res.status(HTTP_STATUSES.CREATED).send(newPost);
};
