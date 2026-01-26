import { Response } from 'express';

import { HTTP_STATUSES, RequestWithUriParamType } from '../../../core/types';
import { postsService } from '../../application';

export const deletePostByIdHandler = async (req: RequestWithUriParamType, res: Response) => {
  const isDeleted = await postsService.deletePostById(req.params.id);

  if (!isDeleted) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
