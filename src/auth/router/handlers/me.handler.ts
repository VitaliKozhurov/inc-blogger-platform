import { Request, Response } from 'express';

import { HTTP_STATUSES } from '../../../core/types';
import { usersQWRepository } from '../../../users/repository';

export const meHandler = async (req: Request, res: Response) => {
  const userId = req.userId;

  const user = userId ? await usersQWRepository.getMeUserById(userId) : null;

  if (!user) {
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
  }

  res.status(HTTP_STATUSES.OK).send(user);
};
