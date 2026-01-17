import { Router } from 'express';

import { APP_ROUTES } from '../../core/constants';
import {
  authMiddleware,
  idUriParamValidatorMiddleware,
  sortAndPaginationMiddleware,
} from '../../core/middleware';
import { postInputModelMiddleware } from '../middleware/post-input-model.middleware';
import { PostSortFields } from '../types';

import { createPostHandler } from './handlers/create-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { getPostHandler } from './handlers/get-post.handler';
import { getPostsHandler } from './handlers/get-posts.handler';
import { updatePostHandler } from './handlers/update-post.handler';

export const postRouter = Router();

postRouter.get(APP_ROUTES.ROOT, sortAndPaginationMiddleware(PostSortFields), getPostsHandler);

postRouter.get(APP_ROUTES.ID, idUriParamValidatorMiddleware, getPostHandler);

postRouter.post(APP_ROUTES.ROOT, authMiddleware, postInputModelMiddleware, createPostHandler);

postRouter.put(
  APP_ROUTES.ID,
  authMiddleware,
  idUriParamValidatorMiddleware,
  postInputModelMiddleware,
  updatePostHandler
);

postRouter.delete(APP_ROUTES.ID, authMiddleware, idUriParamValidatorMiddleware, deletePostHandler);
