import { Router } from 'express';

import { accessTokenMiddleware } from '../../auth/middleware';
import { iocContainer } from '../../composition-root';
import { APP_ROUTES } from '../../core/constants';
import { idUriParamMiddleware, checkValidationMiddleware } from '../../core/middleware';
import { CommentsController } from '../controller';
import { commentInputModelMiddleware } from '../middleware/comment-input-model.middleware';

const commentsController = iocContainer.get(CommentsController);

export const commentRouter = Router();

commentRouter.get(
  APP_ROUTES.ID,
  idUriParamMiddleware,
  checkValidationMiddleware,
  commentsController.getCommentById
);

commentRouter.put(
  APP_ROUTES.ID,
  accessTokenMiddleware,
  idUriParamMiddleware,
  commentInputModelMiddleware,
  checkValidationMiddleware,
  commentsController.updateCommentById
);

commentRouter.delete(
  APP_ROUTES.ID,
  accessTokenMiddleware,
  idUriParamMiddleware,
  checkValidationMiddleware,
  commentsController.deleteCommentById
);
