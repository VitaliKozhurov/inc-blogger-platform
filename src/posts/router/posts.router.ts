import { Router } from 'express';

import { APP_ROUTES } from '../../core/constants';
import { authMiddleware, idUriParamMiddleware } from '../../core/middleware';
import { postInputQueryMiddleware } from '../middleware';
import { postInputModelMiddleware } from '../middleware/post-input-model.middleware';

import { createPostHandler } from './handlers/create-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { getPostByIdHandler } from './handlers/get-post-by-id.handler';
import { getPostsHandler } from './handlers/get-posts.handler';
import { updatePostHandler } from './handlers/update-post.handler';

export const postRouter = Router();

postRouter.get(APP_ROUTES.ROOT, postInputQueryMiddleware, getPostsHandler);

postRouter.get(APP_ROUTES.ID, idUriParamMiddleware, getPostByIdHandler);

postRouter.post(APP_ROUTES.ROOT, authMiddleware, postInputModelMiddleware, createPostHandler);

postRouter.put(
  APP_ROUTES.ID,
  authMiddleware,
  idUriParamMiddleware,
  postInputModelMiddleware,
  updatePostHandler
);

postRouter.delete(APP_ROUTES.ID, authMiddleware, idUriParamMiddleware, deletePostHandler);
