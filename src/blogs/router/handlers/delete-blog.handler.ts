import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { RequestWithUriParamType } from '../../../core/types';
import { blogRepository } from '../../repository/blog.repository';

export const deleteBlogHandler = (req: RequestWithUriParamType, res: Response) => {
  const isDeleted = blogRepository.deleteBlogById(req.params.id);

  if (isDeleted) {
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  }

  res.sendStatus(HTTP_STATUSES.NOT_FOUND);
};
