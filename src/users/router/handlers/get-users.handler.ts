import { Request, Response } from 'express';
import { matchedData } from 'express-validator';

import { HTTP_STATUSES } from '../../../core/constants';
import { errorsHandler } from '../../../core/errors';
import { usersQWRepository } from '../../repository';
import { UsersRequestQueryType } from '../../types';

export const getUsersHandler = async (req: Request, res: Response) => {
  try {
    const query = matchedData<UsersRequestQueryType>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const postsViewModel = await usersQWRepository.getUsers(query);

    res.status(HTTP_STATUSES.OK).send(postsViewModel);
  } catch (e) {
    errorsHandler(e, res);
  }
};
