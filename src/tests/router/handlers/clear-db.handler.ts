import { Request, Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { blogsCollection, postsCollection } from '../../../db';
import { usersCollection } from '../../../db/mongo.db';

export const clearDBHandler = async (_: Request, res: Response) => {
  try {
    await Promise.all([
      blogsCollection.deleteMany(),
      postsCollection.deleteMany(),
      usersCollection.deleteMany(),
    ]);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
