import { Router } from 'express';

import { accessTokenMiddleware } from '../../auth/middleware';
import { APP_ROUTES } from '../../core/constants';
import { idUriParamMiddleware, checkValidationMiddleware } from '../../core/middleware';
import { commentInputModelMiddleware } from '../middleware/comment-input-model.middleware';

import { deleteCommentByIdHandler } from './handlers/delete-comment-by-id.handler';
import { getCommentByIdHandler } from './handlers/get-comment-by-id.handler';
import { updateCommentByIdHandler } from './handlers/update-comment-by-id.handler';

export const commentRouter = Router();

commentRouter.get(
  APP_ROUTES.ID,
  idUriParamMiddleware,
  checkValidationMiddleware,
  getCommentByIdHandler
);

commentRouter.put(
  APP_ROUTES.ID,
  accessTokenMiddleware,
  idUriParamMiddleware,
  commentInputModelMiddleware,
  checkValidationMiddleware,
  updateCommentByIdHandler
);

commentRouter.delete(
  APP_ROUTES.ID,
  accessTokenMiddleware,
  idUriParamMiddleware,
  checkValidationMiddleware,
  deleteCommentByIdHandler
);
