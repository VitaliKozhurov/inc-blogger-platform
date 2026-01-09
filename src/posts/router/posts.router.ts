import { Router } from 'express';

import { appRoutes } from '../../core/constants';

import { createPostHandler } from './handlers/create-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { getPostHandler } from './handlers/get-post.handler';
import { getPostsHandler } from './handlers/get-posts.handler';
import { updatePostHandler } from './handlers/update-post.handler';

export const postRouter = Router();

postRouter.get(appRoutes.POSTS, getPostsHandler);
postRouter.get(appRoutes.POST_BY_ID, getPostHandler);
postRouter.post(appRoutes.POSTS, createPostHandler);
postRouter.put(appRoutes.POST_BY_ID, updatePostHandler);
postRouter.delete(appRoutes.POST_BY_ID, deletePostHandler);
