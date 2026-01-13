import { Response } from 'express';

import { postRepository } from '../../repository';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model';

import { HTTP_STATUSES } from '@/core/constants';
import { RequestWithUriParamType } from '@/core/types';

export const getPostHandler = async (req: RequestWithUriParamType, res: Response) => {
  try {
    const post = await postRepository.getPostById(req.params.id);

    if (post) {
      const postViewModel = mapToPostViewModel(post);

      return res.status(HTTP_STATUSES.OK).send(postViewModel);
    }

    res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
