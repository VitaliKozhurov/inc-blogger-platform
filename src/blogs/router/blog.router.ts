import { Router } from 'express';

import { APP_ROUTES } from '../../core/constants';
import {
  authMiddleware,
  sortAndPaginationMiddleware,
  idUriParamValidatorMiddleware,
} from '../../core/middleware';
import { postInputModelMiddleware } from '../../posts/middleware/post-input-model.middleware';
import { PostSortFields } from '../../posts/types';
import { blogInputModelMiddleware } from '../middleware/blog-input-model.middleware';
import { BlogSortFields } from '../types';

import { createBlogHandler } from './handlers/create-blog.handler';
import { createPostByBlogIdHandler } from './handlers/create-post-by-blog-id.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import { getBlogByIdHandler } from './handlers/get-blog.handler';
import { getBlogsHandler } from './handlers/get-blogs.handler';
import { getPostsByBlogIdHandler } from './handlers/get-posts-by-blog-id.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';

export const blogRouter = Router();

blogRouter.get(APP_ROUTES.ROOT, sortAndPaginationMiddleware(BlogSortFields), getBlogsHandler);

blogRouter.get(APP_ROUTES.ID, idUriParamValidatorMiddleware, getBlogByIdHandler);

blogRouter.post(APP_ROUTES.ROOT, authMiddleware, blogInputModelMiddleware, createBlogHandler);

blogRouter.put(
  APP_ROUTES.ID,
  authMiddleware,
  idUriParamValidatorMiddleware,
  blogInputModelMiddleware,
  updateBlogHandler
);

blogRouter.delete(APP_ROUTES.ID, authMiddleware, idUriParamValidatorMiddleware, deleteBlogHandler);

blogRouter.get(
  `${APP_ROUTES.ID}/${APP_ROUTES.POSTS}`,
  idUriParamValidatorMiddleware,
  sortAndPaginationMiddleware(PostSortFields),
  getPostsByBlogIdHandler
);

blogRouter.post(
  `${APP_ROUTES.ID}/${APP_ROUTES.POSTS}`,
  authMiddleware,
  idUriParamValidatorMiddleware,
  postInputModelMiddleware,
  createPostByBlogIdHandler
);
