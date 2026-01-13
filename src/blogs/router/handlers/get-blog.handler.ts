import { Response } from 'express';

import { blogRepository } from '../../repository';

import { HTTP_STATUSES } from '@/core/constants';
import { RequestWithUriParamType } from '@/core/types';

export const getBlogByIdHandler = async (req: RequestWithUriParamType, res: Response) => {
  try {
    const blogId = req.params.id;

    const blog = await blogRepository.getBlogById(blogId);

    if (blog) {
      return res.status(HTTP_STATUSES.OK).send(blog);
    }

    res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
