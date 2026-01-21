import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { errorsHandler } from '../../../core/errors';
import { RequestWithUriParamType } from '../../../core/types';
import { usersService } from '../../application';

export const deleteUserByIdHandler = async (req: RequestWithUriParamType, res: Response) => {
  try {
    await usersService.deleteUserById(req.params.id);

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  } catch (e) {
    errorsHandler(e, res);
  }
};
