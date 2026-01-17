import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { errorsHandler } from '../../../core/errors';
import { RequestWithUriParamType } from '../../../core/types';
import { postService } from '../../application';

export const deletePostHandler = async (req: RequestWithUriParamType, res: Response) => {
  try {
    await postService.deletePostById(req.params.id);

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  } catch (e) {
    errorsHandler(e, res);
  }
};
