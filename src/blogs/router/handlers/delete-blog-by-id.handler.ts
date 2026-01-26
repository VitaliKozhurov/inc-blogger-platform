import { Response } from 'express';

import { HTTP_STATUSES, RequestWithUriParamType } from '../../../core/types';
import { blogsService } from '../../application';

export const deleteBlogByIdHandler = async (req: RequestWithUriParamType, res: Response) => {
  const isDeleted = await blogsService.deleteBlogById(req.params.id);

  if (!isDeleted) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
