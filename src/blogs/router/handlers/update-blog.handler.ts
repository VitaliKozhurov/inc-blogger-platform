import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { IdParamType, RequestWithBodyAndParamType } from '../../../core/types';
import { blogRepository } from '../../repository/blog.repository';
import { BlogInputModelType } from '../../types/blog';

export const updateBlogHandler = (
  req: RequestWithBodyAndParamType<IdParamType, BlogInputModelType>,
  res: Response
) => {
  const isUpdated = blogRepository.updateBlogById({ id: req.params.id, body: req.body });

  if (isUpdated) {
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  }

  res.sendStatus(HTTP_STATUSES.NOT_FOUND);
};
