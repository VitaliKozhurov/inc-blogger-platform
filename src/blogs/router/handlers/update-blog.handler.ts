import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { errorsHandler } from '../../../core/errors';
import { IdParamType, RequestWithParamAndBodyType } from '../../../core/types';
import { blogsService } from '../../application';
import { UpdateBlogInputType } from '../../types';

export const updateBlogHandler = async (
  req: RequestWithParamAndBodyType<IdParamType, UpdateBlogInputType>,
  res: Response
) => {
  try {
    await blogsService.updateBlogById({ id: req.params.id, blogData: req.body });

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  } catch (e) {
    errorsHandler(e, res);
  }
};
