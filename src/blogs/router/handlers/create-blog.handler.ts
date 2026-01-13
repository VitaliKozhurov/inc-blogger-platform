import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { RequestWithBodyType } from '../../../core/types';
import { blogRepository } from '../../repository';
import { BlogInputDTO, CreateBlogDTOType } from '../../types/blog';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model';

export const createBlogHandler = async (req: RequestWithBodyType<BlogInputDTO>, res: Response) => {
  try {
    const newBlog: CreateBlogDTOType = {
      ...req.body,
      isMembership: true,
      createdAt: new Date().toISOString(),
    };

    const createdBlog = await blogRepository.createBlog(newBlog);
    const createdBlogViewModel = mapToBlogViewModel(createdBlog);

    res.status(HTTP_STATUSES.CREATED).send(createdBlogViewModel);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
