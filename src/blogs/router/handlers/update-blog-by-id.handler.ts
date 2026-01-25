import { Response } from 'express';


import { errorsHandler } from '../../../core/errors';
import { HTTP_STATUSES, IdParamType, RequestWithParamAndBodyType } from '../../../core/types';
import { blogsService } from '../../application';
import { UpdateBlogInputType } from '../../types';

export const updateBlogByIdHandler = async (
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
