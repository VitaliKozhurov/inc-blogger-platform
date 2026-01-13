import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { RequestWithBodyAndParamType, IdParamType } from '../../../core/types';
import { postRepository } from '../../repository';
import { PostInputDTO } from '../../types/post';

export const updatePostHandler = async (
  req: RequestWithBodyAndParamType<IdParamType, PostInputDTO>,
  res: Response
) => {
  try {
    const isUpdated = await postRepository.updatePostById({ id: req.params.id, body: req.body });

    if (isUpdated) {
      return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    }

    res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
