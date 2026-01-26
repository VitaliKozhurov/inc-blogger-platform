import { Response } from 'express';

import { HTTP_STATUSES, RequestWithBodyType } from '../../../core/types';
import { blogsService } from '../../application';
import { blogsQWRepository } from '../../repository';
import { CreateBlogInputType } from '../../types';

export const createBlogHandler = async (
  req: RequestWithBodyType<CreateBlogInputType>,
  res: Response
) => {
  const blogId = await blogsService.createBlog(req.body);

  const createdBlogViewModel = await blogsQWRepository.getBlogById(blogId);

  if (!createdBlogViewModel) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  return res.status(HTTP_STATUSES.CREATED).send(createdBlogViewModel);
};
