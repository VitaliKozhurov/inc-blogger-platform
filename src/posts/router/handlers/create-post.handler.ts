import { Response } from 'express';

import { postRepository } from '../../repository';
import { CreatePostDTOType, PostInputDTO } from '../../types/post';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model';

import { HTTP_STATUSES } from '@/core/constants';
import { RequestWithBodyType } from '@/core/types';

export const createPostHandler = async (req: RequestWithBodyType<PostInputDTO>, res: Response) => {
  try {
    const newPost: CreatePostDTOType = { ...req.body, createdAt: new Date().toISOString() };

    const createdPost = await postRepository.createPost(newPost);

    if (createdPost) {
      const createdPostViewModel = mapToPostViewModel(createdPost);

      return res.status(HTTP_STATUSES.CREATED).send(createdPostViewModel);
    }

    res.sendStatus(HTTP_STATUSES.BAD_REQUEST);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
