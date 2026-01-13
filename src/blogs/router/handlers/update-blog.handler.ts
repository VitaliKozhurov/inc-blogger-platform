import { Response } from 'express';

import { blogRepository } from '../../repository';
import { BlogInputDTO } from '../../types/blog';

import { HTTP_STATUSES } from '@/core/constants';
import { IdParamType, RequestWithBodyAndParamType } from '@/core/types';

export const updateBlogHandler = async (
  req: RequestWithBodyAndParamType<IdParamType, BlogInputDTO>,
  res: Response
) => {
  try {
    const isUpdated = await blogRepository.updateBlogById({ id: req.params.id, body: req.body });

    if (isUpdated) {
      return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    }

    res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
