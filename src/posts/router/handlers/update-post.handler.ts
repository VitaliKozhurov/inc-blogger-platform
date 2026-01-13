import { Response } from 'express';

import { postRepository } from '../../repository';
import { PostInputDTO } from '../../types/post';

import { HTTP_STATUSES } from '@/core/constants';
import { IdParamType, RequestWithBodyAndParamType } from '@/core/types';

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
