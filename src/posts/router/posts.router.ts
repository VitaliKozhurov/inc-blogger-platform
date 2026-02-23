import { Router } from 'express';

import { accessTokenMiddleware, basicAuthMiddleware } from '../../auth/middleware';
import {
  commentInputModelMiddleware,
  commentInputQueryMiddleware,
} from '../../comments/middleware';
import { iocContainer } from '../../composition-root';
import { APP_ROUTES } from '../../core/constants';
import { checkValidationMiddleware, idUriParamMiddleware } from '../../core/middleware';
import { PostsController } from '../controller';
import { postInputQueryMiddleware } from '../middleware';
import { postInputModelMiddleware } from '../middleware/post-input-model.middleware';

const postsController = iocContainer.get(PostsController);

export const postRouter = Router();

postRouter.get(
  APP_ROUTES.ROOT,
  postInputQueryMiddleware,
  checkValidationMiddleware,
  postsController.getPosts.bind(postsController)
);

postRouter.get(
  APP_ROUTES.ID,
  idUriParamMiddleware,
  checkValidationMiddleware,
  postsController.getPostById.bind(postsController)
);

postRouter.post(
  APP_ROUTES.ROOT,
  basicAuthMiddleware,
  postInputModelMiddleware,
  checkValidationMiddleware,
  postsController.createPost.bind(postsController)
);

postRouter.put(
  APP_ROUTES.ID,
  basicAuthMiddleware,
  idUriParamMiddleware,
  postInputModelMiddleware,
  checkValidationMiddleware,
  postsController.updatePostById.bind(postsController)
);

postRouter.delete(
  APP_ROUTES.ID,
  basicAuthMiddleware,
  idUriParamMiddleware,
  checkValidationMiddleware,
  postsController.deletePostById.bind(postsController)
);

postRouter.get(
  `${APP_ROUTES.ID}${APP_ROUTES.COMMENTS}`,
  idUriParamMiddleware,
  commentInputQueryMiddleware,
  checkValidationMiddleware,
  postsController.getCommentsByPostId.bind(postsController)
);

postRouter.post(
  `${APP_ROUTES.ID}${APP_ROUTES.COMMENTS}`,
  accessTokenMiddleware,
  idUriParamMiddleware,
  commentInputModelMiddleware,
  checkValidationMiddleware,
  postsController.createCommentByPostId.bind(postsController)
);
