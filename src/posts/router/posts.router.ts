import { Router } from 'express';

import { basicAuthMiddleware } from '../../auth/middleware';
import { APP_ROUTES } from '../../core/constants';
import { checkValidationMiddleware, idUriParamMiddleware } from '../../core/middleware';
import { postInputQueryMiddleware } from '../middleware';
import { postInputModelMiddleware } from '../middleware/post-input-model.middleware';

import { createPostHandler } from './handlers/create-post.handler';
import { deletePostByIdHandler } from './handlers/delete-post-by-id.handler';
import { getPostByIdHandler } from './handlers/get-post-by-id.handler';
import { getPostsHandler } from './handlers/get-posts.handler';
import { updatePostByIdHandler } from './handlers/update-post-by-id.handler';

export const postRouter = Router();

postRouter.get(
  APP_ROUTES.ROOT,
  postInputQueryMiddleware,
  checkValidationMiddleware,
  getPostsHandler
);

postRouter.get(APP_ROUTES.ID, idUriParamMiddleware, checkValidationMiddleware, getPostByIdHandler);

postRouter.post(
  APP_ROUTES.ROOT,
  basicAuthMiddleware,
  postInputModelMiddleware,
  checkValidationMiddleware,
  createPostHandler
);

postRouter.put(
  APP_ROUTES.ID,
  basicAuthMiddleware,
  idUriParamMiddleware,
  postInputModelMiddleware,
  checkValidationMiddleware,
  updatePostByIdHandler
);

postRouter.delete(
  APP_ROUTES.ID,
  basicAuthMiddleware,
  idUriParamMiddleware,
  checkValidationMiddleware,
  deletePostByIdHandler
);
