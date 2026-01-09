import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { RequestWithBodyType } from '../../../core/types';
import { postRepository } from '../../repository/post.repository';
import { CreatePostInputType } from '../../types/post';

export const createPostHandler = (req: RequestWithBodyType<CreatePostInputType>, res: Response) => {
  const newPost = postRepository.createPost(req.body);

  res.send(HTTP_STATUSES.CREATED).send(newPost);
};
