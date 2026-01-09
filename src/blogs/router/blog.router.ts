import { Router } from 'express';

import { appRoutes } from '../../core/constants';

export const blogRouter = Router();

blogRouter.get(appRoutes.BLOGS, () => {});
blogRouter.get(appRoutes.BLOG_BY_ID, () => {});
blogRouter.post(appRoutes.BLOGS, () => {});
blogRouter.put(appRoutes.BLOG_BY_ID, () => {});
blogRouter.delete(appRoutes.BLOG_BY_ID, () => {});
