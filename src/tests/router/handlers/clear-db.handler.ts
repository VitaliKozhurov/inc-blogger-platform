import { Request, Response } from 'express';

import { HTTP_STATUSES } from '../../../core/types';
import { blogsCollection, postsCollection } from '../../../db';
import {
  commentsCollection,
  revokedRefreshTokenCollection,
  usersCollection,
} from '../../../db/mongo.db';

export const clearDBHandler = async (_: Request, res: Response) => {
  try {
    await Promise.all([
      blogsCollection.deleteMany(),
      postsCollection.deleteMany(),
      commentsCollection.deleteMany(),
      usersCollection.deleteMany(),
      revokedRefreshTokenCollection.deleteMany(),
    ]);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
