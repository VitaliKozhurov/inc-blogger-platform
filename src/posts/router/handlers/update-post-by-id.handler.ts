import { Response } from 'express';

import { HTTP_STATUSES, IdParamType, RequestWithParamAndBodyType } from '../../../core/types';
import { RESULT_STATUSES, resultCodeToHttpException } from '../../../core/utils';
import { postsService } from '../../application';

import { UpdatePostInputType } from './../../types/post.input';

export const updatePostByIdHandler = async (
  req: RequestWithParamAndBodyType<IdParamType, UpdatePostInputType>,
  res: Response
) => {
  const result = await postsService.updatePostById({ id: req.params.id, postData: req.body });

  if (result.status !== RESULT_STATUSES.OK) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }

  return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
