import { Response } from 'express';

import { blogRepository } from '../../repository';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model';

import { HTTP_STATUSES } from '@/core/constants';
import { RequestWithUriParamType } from '@/core/types';

export const getBlogByIdHandler = async (req: RequestWithUriParamType, res: Response) => {
  try {
    const blogId = req.params.id;

    const blog = await blogRepository.getBlogById(blogId);

    if (blog) {
      const blogViewModel = mapToBlogViewModel(blog);

      return res.status(HTTP_STATUSES.OK).send(blogViewModel);
    }

    res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
