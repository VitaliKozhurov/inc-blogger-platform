import { Response } from 'express';

import { HTTP_STATUSES, IdParamType, RequestWithParamAndBodyType } from '../../../core/types';
import { RESULT_STATUSES, resultCodeToHttpException } from '../../../core/utils';
import { blogsService } from '../../application';
import { UpdateBlogInputType } from '../../types';

export const updateBlogByIdHandler = async (
  req: RequestWithParamAndBodyType<IdParamType, UpdateBlogInputType>,
  res: Response
) => {
  const result = await blogsService.updateBlogById({ id: req.params.id, blogData: req.body });

  if (result.status !== RESULT_STATUSES.OK) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }

  return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
