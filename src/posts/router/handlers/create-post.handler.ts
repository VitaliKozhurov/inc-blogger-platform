import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { RequestWithBodyType } from '../../../core/types';
import { postRepository } from '../../repository/post.repository';
import { PostInputModelType } from '../../types/post';

export const createPostHandler = (req: RequestWithBodyType<PostInputModelType>, res: Response) => {
  const newPost = postRepository.createPost(req.body);

  if (newPost) {
    res.status(HTTP_STATUSES.CREATED).send(newPost);
  }

  res.sendStatus(HTTP_STATUSES.BAD_REQUEST);
};
