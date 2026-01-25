import { Response } from 'express';

import { errorsHandler } from '../../../core/errors';
import { HTTP_STATUSES, RequestWithUriParamType } from '../../../core/types';
import { blogsService } from '../../application';

export const deleteBlogByIdHandler = async (req: RequestWithUriParamType, res: Response) => {
  try {
    await blogsService.deleteBlogById(req.params.id);

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  } catch (e) {
    errorsHandler(e, res);
  }
};
