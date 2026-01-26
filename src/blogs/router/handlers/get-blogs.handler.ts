import { Request, Response } from 'express';
import { matchedData } from 'express-validator';

import { HTTP_STATUSES } from '../../../core/types';
import { blogsQWRepository } from '../../repository';
import { BlogsRequestQueryType } from '../../types';

export const getBlogsHandler = async (req: Request, res: Response) => {
  const query = matchedData<BlogsRequestQueryType>(req, {
    locations: ['query'],
    includeOptionals: true,
  });

  const blogsViewModels = await blogsQWRepository.getBlogs(query);

  return res.status(HTTP_STATUSES.OK).send(blogsViewModels);
};
