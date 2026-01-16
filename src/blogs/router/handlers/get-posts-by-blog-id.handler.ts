import { Response } from 'express';
import { matchedData } from 'express-validator';

import { HTTP_STATUSES } from '../../../core/constants';
import { IdParamType, RequestWithParamAndQueryType } from '../../../core/types/util-types';
import { postService } from '../../../posts/application';
import { PostRequestQueryType } from '../../../posts/types';

export const getPostsByBlogIdHandler = async (
  req: RequestWithParamAndQueryType<IdParamType, PostRequestQueryType>,
  res: Response
) => {
  try {
    const blogId = req.params.id;

    const query = matchedData<PostRequestQueryType>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const posts = await postService.getPostByBlogId({ blogId, query });
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
