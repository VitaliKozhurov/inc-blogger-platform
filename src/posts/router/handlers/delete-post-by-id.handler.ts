import { Response } from 'express';

import { errorsHandler } from '../../../core/errors';
import { HTTP_STATUSES, RequestWithUriParamType } from '../../../core/types';
import { postsService } from '../../application';

export const deletePostByIdHandler = async (req: RequestWithUriParamType, res: Response) => {
  try {
    await postsService.deletePostById(req.params.id);

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  } catch (e) {
    errorsHandler(e, res);
  }
};
