import { Request, Response, Router } from 'express';

import { APP_ROUTES } from '../../core/constants';
import { HTTP_STATUSES } from '../../core/types';
import { RequestLogModel } from '../app-services';
import { BlogModel } from '../blogs';
import { CommentModel } from '../comments';
import { LikeModel } from '../likes';
import { PostModel } from '../posts';
import { UserDeviceSessionModel } from '../user-device-session';
import { UserModel } from '../users';

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
      LikeModel.deleteMany(),
    ]);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  } catch {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR);
  }
});
