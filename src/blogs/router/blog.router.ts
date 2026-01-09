import { Router } from 'express';

import { APP_ROUTES } from '../../core/constants';

import { paramIdValidatorMiddleware } from './../../core/middleware';
import { createBlogHandler } from './handlers/create-blog.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import { getBlogByIdHandler } from './handlers/get-blog.handler';
import { getBlogsHandler } from './handlers/get-blogs.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';

export const blogRouter = Router();

blogRouter.get(APP_ROUTES.ROOT, getBlogsHandler);
blogRouter.get(APP_ROUTES.ID, paramIdValidatorMiddleware, getBlogByIdHandler);
blogRouter.post(APP_ROUTES.ROOT, createBlogHandler);
blogRouter.put(APP_ROUTES.ID, paramIdValidatorMiddleware, updateBlogHandler);
blogRouter.delete(APP_ROUTES.ID, paramIdValidatorMiddleware, deleteBlogHandler);
