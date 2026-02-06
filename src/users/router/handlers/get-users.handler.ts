import { Request, Response } from 'express';
import { matchedData } from 'express-validator';

import { HTTP_STATUSES } from '../../../core/types';
import { usersQWRepository } from '../../repository';
import { UsersRequestQueryType } from '../../types';

export const getUsersHandler = async (req: Request, res: Response) => {
  const query = matchedData<UsersRequestQueryType>(req, {
    locations: ['query'],
    includeOptionals: true,
  });

  const usersViewModel = await usersQWRepository.getUsers(query);

  res.status(HTTP_STATUSES.OK).send(usersViewModel);
};
