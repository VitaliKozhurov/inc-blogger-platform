import { Router } from 'express';

import { APP_ROUTES } from '../../core/constants';
import { paramIdValidatorMiddleware } from '../../core/middleware';

import { createPostHandler } from './handlers/create-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { getPostHandler } from './handlers/get-post.handler';
import { getPostsHandler } from './handlers/get-posts.handler';
import { updatePostHandler } from './handlers/update-post.handler';

export const postRouter = Router();

postRouter.get(APP_ROUTES.ROOT, getPostsHandler);
postRouter.get(APP_ROUTES.ID, paramIdValidatorMiddleware, getPostHandler);
postRouter.post(APP_ROUTES.ROOT, createPostHandler);
postRouter.put(APP_ROUTES.ID, paramIdValidatorMiddleware, updatePostHandler);
postRouter.delete(APP_ROUTES.ID, paramIdValidatorMiddleware, deletePostHandler);
