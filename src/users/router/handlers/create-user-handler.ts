import { Response } from 'express';

import { HTTP_STATUSES, RequestWithBodyType } from '../../../core/types';
import { usersService } from '../../application';
import { usersQWRepository } from '../../repository';
import { CreateUserInputType } from '../../types';

export const createUserHandler = async (
  req: RequestWithBodyType<CreateUserInputType>,
  res: Response
) => {
  const result = await usersService.createUser(req.body);

  if (result.status !== HTTP_STATUSES.OK) {
    return res.status(HTTP_STATUSES.BAD_REQUEST).send({ errorMessages: result.extensions });
  }

  const createdUser = await usersQWRepository.getUserById(result.data!.id);

  return res.status(HTTP_STATUSES.CREATED).send(createdUser);
};
