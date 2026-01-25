import { Response } from 'express';
import { matchedData } from 'express-validator';

import { errorsHandler } from '../../../core/errors';
import { HTTP_STATUSES, RequestWithQueryType } from '../../../core/types';
import { blogsQWRepository } from '../../repository';
import { BlogsRequestQueryType } from '../../types';

export const getBlogsHandler = async (
  req: RequestWithQueryType<BlogsRequestQueryType>,
  res: Response
) => {
  try {
    const query = matchedData<BlogsRequestQueryType>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const blogViewModels = await blogsQWRepository.getBlogs(query);

    res.status(HTTP_STATUSES.OK).send(blogViewModels);
  } catch (e) {
    errorsHandler(e, res);
  }
};
