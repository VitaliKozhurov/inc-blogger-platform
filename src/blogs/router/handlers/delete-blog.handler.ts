import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { RequestWithUriParamType } from '../../../core/types';
import { blogRepository } from '../../repository';

export const deleteBlogHandler = async (req: RequestWithUriParamType, res: Response) => {
  try {
    const isDeleted = await blogRepository.deleteBlogById(req.params.id);

    if (isDeleted) {
      return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    }

    res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
