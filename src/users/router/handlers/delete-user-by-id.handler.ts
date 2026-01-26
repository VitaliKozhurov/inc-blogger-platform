import { Response } from 'express';

import { HTTP_STATUSES, RequestWithUriParamType } from '../../../core/types';
import { usersService } from '../../application';

export const deleteUserByIdHandler = async (req: RequestWithUriParamType, res: Response) => {
  const isDeleted = await usersService.deleteUserById(req.params.id);

  if (!isDeleted) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
  }

  return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};
