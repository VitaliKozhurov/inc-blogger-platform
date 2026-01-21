import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { errorsHandler } from '../../../core/errors';
import { RequestWithBodyType } from '../../../core/types';
import { blogsService } from '../../application';
import { blogsQWRepository } from '../../repository';
import { CreateBlogInputType } from '../../types';
import { mapToBlogViewModel } from '../mappers';

export const createBlogHandler = async (
  req: RequestWithBodyType<CreateBlogInputType>,
  res: Response
) => {
  try {
    // TODO что если блог создался но запрос за блогом не прошел

    const blogId = await blogsService.createBlog(req.body);

    const createdBlog = await blogsQWRepository.getBlogByIdOrFail(blogId);

    const createdBlogViewModel = mapToBlogViewModel(createdBlog);

    res.status(HTTP_STATUSES.CREATED).send(createdBlogViewModel);
  } catch (e) {
    errorsHandler(e, res);
  }
};
