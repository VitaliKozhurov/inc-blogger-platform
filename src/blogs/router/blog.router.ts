import { Router } from 'express';

import { APP_ROUTES } from '../../core/constants';
import { blogInputModelMiddleware } from '../middleware/blog-input-model.middleware';
import { BlogSortFields } from '../types';

import {
  authMiddleware,
  sortAndPaginationMiddleware,
  idUriParamValidatorMiddleware,
} from './../../core/middleware';
import { createBlogHandler } from './handlers/create-blog.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import { getBlogByIdHandler } from './handlers/get-blog.handler';
import { getBlogsHandler } from './handlers/get-blogs.handler';
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
