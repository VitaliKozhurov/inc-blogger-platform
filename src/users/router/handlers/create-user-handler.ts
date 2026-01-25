import { Response } from 'express';

import { errorsHandler } from '../../../core/errors';
import { HTTP_STATUSES, RequestWithBodyType } from '../../../core/types';
import { usersService } from '../../application';
import { usersQWRepository } from '../../repository';
import { CreateUserInputType } from '../../types';

export const createUserHandler = async (
  req: RequestWithBodyType<CreateUserInputType>,
  res: Response
) => {
  try {
    const result = await usersService.createUser(req.body);

    if (typeof result === 'string') {
      const createdUser = await usersQWRepository.getUserByIdOrFail(result);

      return res.status(HTTP_STATUSES.CREATED).send(createdUser);
    }

    res.status(HTTP_STATUSES.BAD_REQUEST).send(result);
  } catch (e) {
    errorsHandler(e, res);
  }
};
