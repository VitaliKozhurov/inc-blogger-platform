import { Router } from 'express';

import { basicAuthMiddleware } from '../../auth/middleware';
import { iocContainer } from '../../composition-root';
import { APP_ROUTES } from '../../core/constants';
import { checkValidationMiddleware, idUriParamMiddleware } from '../../core/middleware';
import { postByBlogIdInputModelMiddleware, postInputQueryMiddleware } from '../../posts/middleware';
import { BlogsController } from '../controller';
import { blogInputModelMiddleware } from '../middleware/blog-input-model.middleware';
import { blogInputQueryMiddleware } from '../middleware/blog-input-query.middleware';

const blogsController = iocContainer.get(BlogsController);

export const blogRouter = Router();

blogRouter.get(
  APP_ROUTES.ROOT,
  blogInputQueryMiddleware,
  checkValidationMiddleware,
  blogsController.getBlogs
);

blogRouter.get(
  APP_ROUTES.ID,
  idUriParamMiddleware,
  checkValidationMiddleware,
  blogsController.getBlogById
);

blogRouter.post(
  APP_ROUTES.ROOT,
  basicAuthMiddleware,
  blogInputModelMiddleware,
  checkValidationMiddleware,
  blogsController.createBlog
);

blogRouter.put(
  APP_ROUTES.ID,
  basicAuthMiddleware,
  idUriParamMiddleware,
  blogInputModelMiddleware,
  checkValidationMiddleware,
  blogsController.updateBlogById
);

blogRouter.delete(
  APP_ROUTES.ID,
  basicAuthMiddleware,
  idUriParamMiddleware,
  checkValidationMiddleware,
  blogsController.deleteBlogById
);

blogRouter.get(
  `${APP_ROUTES.ID}${APP_ROUTES.POSTS}`,
  idUriParamMiddleware,
  postInputQueryMiddleware,
  checkValidationMiddleware,
  blogsController.getPostsByBlogId
);

blogRouter.post(
  `${APP_ROUTES.ID}${APP_ROUTES.POSTS}`,
  basicAuthMiddleware,
  idUriParamMiddleware,
  postByBlogIdInputModelMiddleware,
  checkValidationMiddleware,
  blogsController.createPostByBlogId
);
