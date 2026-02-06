import { Response } from 'express';

import { HTTP_STATUSES, RequestWithUriParamType } from '../../../core/types';
import { postsQWRepository } from '../../repository';

export const getPostByIdHandler = async (req: RequestWithUriParamType, res: Response) => {
  const postViewModel = await postsQWRepository.getPostById(req.params.id);

  if (!postViewModel) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  return res.status(HTTP_STATUSES.OK).send(postViewModel);
};
