import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { RequestWithUriParamType } from '../../../core/types';
import { blogRepository } from '../../repository/blog.repository';

export const getBlogByIdHandler = (req: RequestWithUriParamType, res: Response) => {
  const blogId = req.params.id;

  const blog = blogRepository.getBlogById(blogId);

  if (blog) {
    return res.status(HTTP_STATUSES.OK).send(blog);
  }

  res.sendStatus(HTTP_STATUSES.NOT_FOUND);
};
