import { Router } from 'express';

import { basicAuthMiddleware } from '../../auth/middleware';
import { APP_ROUTES } from '../../core/constants';
import { checkValidationMiddleware, idUriParamMiddleware } from '../../core/middleware';
import { postByBlogIdInputModelMiddleware, postInputQueryMiddleware } from '../../posts/middleware';
import { blogInputModelMiddleware } from '../middleware/blog-input-model.middleware';
import { blogInputQueryMiddleware } from '../middleware/blog-input-query.middleware';

import { createBlogHandler } from './handlers/create-blog.handler';
import { createPostByBlogIdHandler } from './handlers/create-post-by-blog-id.handler';
import { deleteBlogByIdHandler } from './handlers/delete-blog-by-id.handler';
import { getBlogByIdHandler } from './handlers/get-blog-by-id.handler';
import { getBlogsHandler } from './handlers/get-blogs.handler';
import { getPostsByBlogIdHandler } from './handlers/get-posts-by-blog-id.handler';
import { updateBlogByIdHandler } from './handlers/update-blog-by-id.handler';

export const blogRouter = Router();

blogRouter.get(
  APP_ROUTES.ROOT,
  blogInputQueryMiddleware,
  checkValidationMiddleware,
  getBlogsHandler
);

blogRouter.get(APP_ROUTES.ID, idUriParamMiddleware, checkValidationMiddleware, getBlogByIdHandler);

blogRouter.post(
  APP_ROUTES.ROOT,
  basicAuthMiddleware,
  blogInputModelMiddleware,
  checkValidationMiddleware,
  createBlogHandler
);

blogRouter.put(
  APP_ROUTES.ID,
  basicAuthMiddleware,
  idUriParamMiddleware,
  blogInputModelMiddleware,
  checkValidationMiddleware,
  updateBlogByIdHandler
);

blogRouter.delete(
  APP_ROUTES.ID,
  basicAuthMiddleware,
  idUriParamMiddleware,
  checkValidationMiddleware,
  deleteBlogByIdHandler
);

blogRouter.get(
  `${APP_ROUTES.ID}${APP_ROUTES.POSTS}`,
  idUriParamMiddleware,
  postInputQueryMiddleware,
  checkValidationMiddleware,
  getPostsByBlogIdHandler
);

blogRouter.post(
  `${APP_ROUTES.ID}${APP_ROUTES.POSTS}`,
  basicAuthMiddleware,
  idUriParamMiddleware,
  postByBlogIdInputModelMiddleware,
  checkValidationMiddleware,
  createPostByBlogIdHandler
);
