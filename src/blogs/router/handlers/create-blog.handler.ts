import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { RequestWithBodyType } from '../../../core/types';
import { blogsService } from '../../application/blogs.service';
import { CreateBlogInputType } from '../../types';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model';

export const createBlogHandler = async (
  req: RequestWithBodyType<CreateBlogInputType>,
  res: Response
) => {
  try {
    // TODO что если блог создался но запрос за блогом не прошел

    const blogId = await blogsService.createBlog(req.body);

    const createdBlog = await blogsService.getBlogById(blogId);

    const createdBlogViewModel = mapToBlogViewModel(createdBlog);

    res.status(HTTP_STATUSES.CREATED).send(createdBlogViewModel);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
