import { Response } from 'express';
import { matchedData } from 'express-validator';

import { HTTP_STATUSES, IdParamType, RequestWithParamAndQueryType } from '../../../core/types';
import { postsQWRepository } from '../../../posts/repository';
import { PostsRequestQueryType } from '../../../posts/types';
import { blogsQWRepository } from '../../repository';

export const getPostsByBlogIdHandler = async (
  req: RequestWithParamAndQueryType<IdParamType, Record<string, string>>,
  res: Response
) => {
  const blogId = req.params.id;

  const query = matchedData<PostsRequestQueryType>(req, {
    locations: ['query'],
    includeOptionals: true,
  });

  const blog = await blogsQWRepository.getBlogById(blogId);

  if (!blog) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  const postsViewMode = await postsQWRepository.getPostsByBlogId({ blogId, query });

  return res.status(HTTP_STATUSES.OK).send(postsViewMode);
};
