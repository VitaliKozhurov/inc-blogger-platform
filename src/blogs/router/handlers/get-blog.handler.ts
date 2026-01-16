import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { RequestWithUriParamType } from '../../../core/types';
import { blogsService } from '../../application';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model';

export const getBlogByIdHandler = async (req: RequestWithUriParamType, res: Response) => {
  try {
    const blog = await blogsService.getBlogById(req.params.id);

    const blogViewModel = mapToBlogViewModel(blog);

    return res.status(HTTP_STATUSES.OK).send(blogViewModel);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
