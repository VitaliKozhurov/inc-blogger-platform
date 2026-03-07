import { Router } from 'express';

import { iocContainer } from '../../composition-root';
import { APP_ROUTES } from '../../core/constants';
import { checkValidationMiddleware, idUriParamMiddleware } from '../../core/middleware';
import { accessTokenMiddleware } from '../auth';
import { likeInputModelMiddleware } from '../likes';

import { CommentsController } from './comments.controller';
import { commentInputModelMiddleware } from './middleware/comment-input-model.middleware';

const commentsController = iocContainer.get(CommentsController);

export const commentRouter = Router();

commentRouter.get(
  APP_ROUTES.ID,
  idUriParamMiddleware,
  checkValidationMiddleware,
  commentsController.getCommentById.bind(commentsController)
);

commentRouter.put(
  APP_ROUTES.ID,
  accessTokenMiddleware,
  idUriParamMiddleware,
  commentInputModelMiddleware,
  checkValidationMiddleware,
  commentsController.updateCommentById.bind(commentsController)
);

commentRouter.delete(
  APP_ROUTES.ID,
  accessTokenMiddleware,
  idUriParamMiddleware,
  checkValidationMiddleware,
  commentsController.deleteCommentById.bind(commentsController)
);

commentRouter.put(
  `${APP_ROUTES.ID}${APP_ROUTES.LIKE_STATUS}`,
  accessTokenMiddleware,
  idUriParamMiddleware,
  likeInputModelMiddleware,
  checkValidationMiddleware,
  commentsController.updateCommentLikeStatus.bind(commentsController)
);
