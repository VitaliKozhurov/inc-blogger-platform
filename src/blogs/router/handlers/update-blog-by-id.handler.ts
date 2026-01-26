import { Response } from 'express';

import { HTTP_STATUSES, IdParamType, RequestWithParamAndBodyType } from '../../../core/types';
import { blogsService } from '../../application';
import { UpdateBlogInputType } from '../../types';

export const updateBlogByIdHandler = async (
  req: RequestWithParamAndBodyType<IdParamType, UpdateBlogInputType>,
  res: Response
) => {
  const isUpdated = await blogsService.updateBlogById({ id: req.params.id, blogData: req.body });

  if (!isUpdated) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
