import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { postRepository } from '../../repository/post.repository';

import { RequestWithUriParamType } from './../../../core/types/util-types';

export const deletePostHandler = (req: RequestWithUriParamType, res: Response) => {
  const isDeleted = postRepository.deletePostById(req.params.id);

  if (isDeleted) {
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  }

  res.sendStatus(HTTP_STATUSES.NOT_FOUND);
};
