import { Response } from 'express';

import { blogRepository } from '../../repository';
import { BlogInputDTO, CreateBlogDTOType } from '../../types/blog';

import { HTTP_STATUSES } from '@/core/constants';
import { RequestWithBodyType } from '@/core/types';

export const createBlogHandler = (req: RequestWithBodyType<BlogInputDTO>, res: Response) => {
  const newBlog: CreateBlogDTOType = {
    ...req.body,
    isMembership: true,
    createdAt: new Date().toISOString(),
  };

  const newPost: CreateBlogDTOType = blogRepository.createBlog(req.body);

  res.status(HTTP_STATUSES.CREATED).send(newPost);
};
