import { Router } from 'express';

import { APP_ROUTES } from '../../core/constants';
import { idUriParamValidatorMiddleware } from '../../core/middleware';
import { postInputModelMiddleware } from '../middleware/post-input-model.middleware';

import { createPostHandler } from './handlers/create-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { getPostHandler } from './handlers/get-post.handler';
import { getPostsHandler } from './handlers/get-posts.handler';
import { updatePostHandler } from './handlers/update-post.handler';

export const postRouter = Router();

postRouter.get(APP_ROUTES.ROOT, getPostsHandler);
postRouter.get(APP_ROUTES.ID, idUriParamValidatorMiddleware, getPostHandler);
postRouter.post(APP_ROUTES.ROOT, postInputModelMiddleware, createPostHandler);
postRouter.put(
  APP_ROUTES.ID,
  idUriParamValidatorMiddleware,
  postInputModelMiddleware,
  updatePostHandler
);
postRouter.delete(APP_ROUTES.ID, idUriParamValidatorMiddleware, deletePostHandler);
