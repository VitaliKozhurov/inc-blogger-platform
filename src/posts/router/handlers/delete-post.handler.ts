import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { RequestWithUriParamType } from '../../../core/types';
import { postRepository } from '../../repository';

export const deletePostHandler = async (req: RequestWithUriParamType, res: Response) => {
  try {
    const isDeleted = await postRepository.deletePostById(req.params.id);

    if (isDeleted) {
      return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    }

    res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
