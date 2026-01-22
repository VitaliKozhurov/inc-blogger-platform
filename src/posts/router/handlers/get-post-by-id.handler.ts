import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { errorsHandler } from '../../../core/errors';
import { RequestWithUriParamType } from '../../../core/types';
import { postsQWRepository } from '../../repository';

export const getPostByIdHandler = async (req: RequestWithUriParamType, res: Response) => {
  try {
    const postViewModel = await postsQWRepository.getPostByIdOrFail(req.params.id);

    return res.status(HTTP_STATUSES.OK).send(postViewModel);
  } catch (e) {
    errorsHandler(e, res);
  }
};
