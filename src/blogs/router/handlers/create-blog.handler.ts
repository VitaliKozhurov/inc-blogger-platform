import { Response } from 'express';

import { errorsHandler } from '../../../core/errors';
import { HTTP_STATUSES, RequestWithBodyType } from '../../../core/types';
import { blogsService } from '../../application';
import { blogsQWRepository } from '../../repository';
import { CreateBlogInputType } from '../../types';

export const createBlogHandler = async (
  req: RequestWithBodyType<CreateBlogInputType>,
  res: Response
) => {
  try {
    const blogId = await blogsService.createBlog(req.body);

    const createdBlogViewModel = await blogsQWRepository.getBlogByIdOrFail(blogId);

    res.status(HTTP_STATUSES.CREATED).send(createdBlogViewModel);
  } catch (e) {
    errorsHandler(e, res);
  }
};
