import { Request, Response, Router } from 'express';

import { BlogModel } from '../../blogs/model';
import { CommentModel } from '../../comments/model';
import { APP_ROUTES } from '../../core/constants';
import { HTTP_STATUSES } from '../../core/types';
import { RequestLogModel } from '../../logs/model';
import { PostModel } from '../../posts/model';
import { UserDeviceSessionModel } from '../../sessions/model';
import { UserModel } from '../../users/model';

export const testRouter = Router();

testRouter.delete(APP_ROUTES.CLEAR_DATA, async (_: Request, res: Response) => {
  try {
    await Promise.all([
      BlogModel.deleteMany(),
      PostModel.deleteMany(),
      CommentModel.deleteMany(),
      UserModel.deleteMany(),
      UserDeviceSessionModel.deleteMany(),
      RequestLogModel.deleteMany(),
    ]);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
});
