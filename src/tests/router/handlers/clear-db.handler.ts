import { Request, Response } from 'express';

import { HTTP_STATUSES } from '../../../core/constants';
import { blogCollection, postCollection } from '../../../db';

export const clearDBHandler = async (_: Request, res: Response) => {
  try {
    await Promise.all([blogCollection.deleteMany(), postCollection.deleteMany()]);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
};
