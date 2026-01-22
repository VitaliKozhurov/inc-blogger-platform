import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { errorsHandler } from '../../../core/errors';
import { IdParamType, RequestWithParamAndBodyType } from '../../../core/types';
import { postsService } from '../../application';

import { UpdatePostInputType } from './../../types/post.input';

export const updatePostByIdHandler = async (
  req: RequestWithParamAndBodyType<IdParamType, UpdatePostInputType>,
  res: Response
) => {
  try {
    await postsService.updatePostById({ id: req.params.id, postData: req.body });

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  } catch (e) {
    errorsHandler(e, res);
  }
};
