import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { RequestWithParamAndBodyType, IdParamType } from '../../../core/types';
import { postService } from '../../application';

import { UpdatePostInputType } from './../../types/post.input';

export const updatePostHandler = async (
  req: RequestWithParamAndBodyType<IdParamType, UpdatePostInputType>,
  res: Response
) => {
  try {
    await postService.updatePostById({ id: req.params.id, postData: req.body });

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
