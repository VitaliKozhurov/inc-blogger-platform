import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { RequestWithUriParamType } from '../../../core/types';
import { postService } from '../../application';
import { mapToPostViewModel } from '../mappers/map-to-post-view-model';

export const getPostHandler = async (req: RequestWithUriParamType, res: Response) => {
  try {
    const post = await postService.getPostById(req.params.id);

    const postViewModel = mapToPostViewModel(post);

    return res.status(HTTP_STATUSES.OK).send(postViewModel);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
