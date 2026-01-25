import { Response } from 'express';

import { errorsHandler } from '../../../core/errors';
import { HTTP_STATUSES, RequestWithUriParamType } from '../../../core/types';
import { blogsQWRepository } from '../../repository';

export const getBlogByIdHandler = async (req: RequestWithUriParamType, res: Response) => {
  try {
    const blogViewModel = await blogsQWRepository.getBlogByIdOrFail(req.params.id);

    return res.status(HTTP_STATUSES.OK).send(blogViewModel);
  } catch (e) {
    errorsHandler(e, res);
  }
};
