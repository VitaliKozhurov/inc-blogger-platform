import { Response } from 'express';

import { HTTP_STATUSES, RequestWithBodyType } from '../../../core/types';
import { blogsService } from '../../application';
import { blogsQWRepository } from '../../repository';
import { CreateBlogInputType } from '../../types';

export const createBlogHandler = async (
  req: RequestWithBodyType<CreateBlogInputType>,
  res: Response
) => {
  const result = await blogsService.createBlog(req.body);

  const createdBlogViewModel = await blogsQWRepository.getBlogById(result.data);

  return res.status(HTTP_STATUSES.CREATED).send(createdBlogViewModel);
};
