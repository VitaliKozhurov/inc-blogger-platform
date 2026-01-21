import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { errorsHandler } from '../../../core/errors';
import { RequestWithUriParamType } from '../../../core/types';
import { postsQWRepository } from '../../repository';
import { mapToPostViewModel } from '../mappers';

export const getPostHandler = async (req: RequestWithUriParamType, res: Response) => {
  try {
    const post = await postsQWRepository.getPostByIdOrFail(req.params.id);

    const postViewModel = mapToPostViewModel(post);

    return res.status(HTTP_STATUSES.OK).send(postViewModel);
  } catch (e) {
    errorsHandler(e, res);
  }
};
