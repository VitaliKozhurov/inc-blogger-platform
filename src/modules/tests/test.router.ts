import { Request, Response, Router } from 'express';

import { APP_ROUTES } from '../../core/constants';
import { HTTP_STATUSES } from '../../core/types';
import { RequestLogModel } from '../app-services/request-log.model';
import { BlogModel } from '../blogs/blog.model';
import { CommentModel } from '../comments/comment.model';
import { LikeModel } from '../likes/like.model';
import { PostModel } from '../posts/post.model';
import { UserDeviceSessionModel } from '../user-device-session/user-device-session.model';
import { UserModel } from '../users/user.model';

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
