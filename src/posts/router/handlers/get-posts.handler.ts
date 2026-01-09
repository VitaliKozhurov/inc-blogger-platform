import { Request, Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { postRepository } from '../../repository/post.repository';

export const getPostsHandler = (_: Request, res: Response) => {
  res.status(HTTP_STATUSES.OK).send(postRepository.getPosts());
};
