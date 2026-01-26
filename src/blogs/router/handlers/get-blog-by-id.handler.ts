import { Response } from 'express';

import { HTTP_STATUSES, RequestWithUriParamType } from '../../../core/types';
import { blogsQWRepository } from '../../repository';

export const getBlogByIdHandler = async (req: RequestWithUriParamType, res: Response) => {
  const blogViewModel = await blogsQWRepository.getBlogById(req.params.id);

  if (!blogViewModel) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  return res.status(HTTP_STATUSES.OK).send(blogViewModel);
};
