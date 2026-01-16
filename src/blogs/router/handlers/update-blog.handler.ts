import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { IdParamType, RequestWithBodyAndParamType } from '../../../core/types';
import { blogRepository } from '../../repository';
import { UpdateBlogInputType } from '../../types';

export const updateBlogHandler = async (
  req: RequestWithBodyAndParamType<IdParamType, UpdateBlogInputType>,
  res: Response
) => {
  try {
    await blogRepository.updateBlogById({ id: req.params.id, blogData: req.body });

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
