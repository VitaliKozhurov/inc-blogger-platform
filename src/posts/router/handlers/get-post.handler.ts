import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { RequestWithUriParamType } from '../../../core/types';
import { postRepository } from '../../repository/post.repository';

export const getPostHandler = (req: RequestWithUriParamType, res: Response) => {
  const post = postRepository.getPostById(req.params.id);

  if (post) {
    return res.status(HTTP_STATUSES.OK).send(post);
  }

  res.sendStatus(HTTP_STATUSES.NOT_FOUND);
};
