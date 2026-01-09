import { Request, Response, Router } from 'express';

import { APP_ROUTES, HTTP_STATUSES } from '../../core/constants';
import { db } from '../../db/db';

export const testRouter = Router();

testRouter.delete(APP_ROUTES.CLEAR_DATA, (_: Request, res: Response) => {
  db.blogs = [];
  db.posts = [];

  res.sendStatus(HTTP_STATUSES.OK);
});
