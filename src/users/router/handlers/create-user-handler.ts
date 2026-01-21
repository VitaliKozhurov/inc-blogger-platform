import { Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { errorsHandler } from '../../../core/errors';
import { RequestWithBodyType } from '../../../core/types';
import { usersService } from '../../application';
import { usersQWRepository } from '../../repository';
import { CreateUserInputType } from '../../types';

export const createUserHandler = async (
  req: RequestWithBodyType<CreateUserInputType>,
  res: Response
) => {
  try {
    const userId = await usersService.createUser(req.body);

    const createdUser = await usersQWRepository.getUserByIdOrFail(userId);

    res.status(HTTP_STATUSES.OK).send(createdUser);
  } catch (e) {
    errorsHandler(e, res);
  }
};
