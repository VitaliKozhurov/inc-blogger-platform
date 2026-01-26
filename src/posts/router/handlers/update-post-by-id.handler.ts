import { Response } from 'express';

import { HTTP_STATUSES, IdParamType, RequestWithParamAndBodyType } from '../../../core/types';
import { postsService } from '../../application';

import { UpdatePostInputType } from './../../types/post.input';

export const updatePostByIdHandler = async (
  req: RequestWithParamAndBodyType<IdParamType, UpdatePostInputType>,
  res: Response
) => {
  const isUpdated = await postsService.updatePostById({ id: req.params.id, postData: req.body });

  if (!isUpdated) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
