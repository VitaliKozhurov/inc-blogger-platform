import { Response } from 'express';

import { HTTP_STATUSES, RequestWithUriParamType } from '../../../core/types';
import { commentsQWRepository } from '../../repository';

export const getCommentByIdHandler = async (req: RequestWithUriParamType, res: Response) => {
  const commentViewModel = await commentsQWRepository.getCommentById(req.params.id);

  if (!commentViewModel) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  return res.status(HTTP_STATUSES.OK).send(commentViewModel);
};
