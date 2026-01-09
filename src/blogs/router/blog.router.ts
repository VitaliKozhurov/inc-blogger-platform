import { Router } from 'express';

import { appRoutes } from '../../core/constants';

import { createBlogHandler } from './handlers/create-blog.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import { getBlogByIdHandler } from './handlers/get-blog.handler';
import { getBlogsHandler } from './handlers/get-blogs.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';

export const blogRouter = Router();

blogRouter.get(appRoutes.BLOGS, getBlogsHandler);

blogRouter.get(appRoutes.BLOG_BY_ID, getBlogByIdHandler);

blogRouter.post(appRoutes.BLOGS, createBlogHandler);

blogRouter.put(appRoutes.BLOG_BY_ID, updateBlogHandler);

blogRouter.delete(appRoutes.BLOG_BY_ID, deleteBlogHandler);
