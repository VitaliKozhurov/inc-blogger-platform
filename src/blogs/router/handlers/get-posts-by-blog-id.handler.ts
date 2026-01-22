import { Response } from 'express';
import { matchedData } from 'express-validator';

import { HTTP_STATUSES } from '../../../core/constants';
import { errorsHandler } from '../../../core/errors';
import { IdParamType, RequestWithParamAndQueryType } from '../../../core/types';
import { postsQWRepository } from '../../../posts/repository';
import { PostsRequestQueryType } from '../../../posts/types';
import { blogsQWRepository } from '../../repository';

export const getPostsByBlogIdHandler = async (
  req: RequestWithParamAndQueryType<IdParamType, PostsRequestQueryType>,
  res: Response
) => {
  try {
    const blogId = req.params.id;

    const query = matchedData<PostsRequestQueryType>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    await blogsQWRepository.getBlogByIdOrFail(blogId);

    const postsViewMode = await postsQWRepository.getPostsByBlogId({ blogId, query });

    return res.status(HTTP_STATUSES.OK).send(postsViewMode);
  } catch (e) {
    errorsHandler(e, res);
  }
};
