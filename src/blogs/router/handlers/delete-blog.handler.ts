import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { RequestWithUriParamType } from '../../../core/types';
import { blogsService } from '../../application';

export const deleteBlogHandler = async (req: RequestWithUriParamType, res: Response) => {
  try {
    await blogsService.deleteBlogById(req.params.id);

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
