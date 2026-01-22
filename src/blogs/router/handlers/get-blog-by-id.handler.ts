import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { errorsHandler } from '../../../core/errors';
import { RequestWithUriParamType } from '../../../core/types';
import { blogsQWRepository } from '../../repository';

export const getBlogByIdHandler = async (req: RequestWithUriParamType, res: Response) => {
  try {
    const blogViewModel = await blogsQWRepository.getBlogByIdOrFail(req.params.id);

    return res.status(HTTP_STATUSES.OK).send(blogViewModel);
  } catch (e) {
    errorsHandler(e, res);
  }
};
