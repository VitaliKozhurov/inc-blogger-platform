import { Server } from 'http';

import { Express } from 'express';

import { authRouter } from './auth/router/auth.router';
import { blogRouter } from './blogs/router/blog.router';
import { commentRouter } from './comments/router/comment.router';
import { APP_ROUTES } from './core/constants';
import { bodyParserMiddleware, globalErrorMiddleware } from './core/middleware';
import { postRouter } from './posts/router/posts.router';
import { testRouter } from './tests/router/test.router';
import { userRouter } from './users/router/user.router';

const PORT = process.env.PORT || 5000;

export const initApp = (app: Express): Promise<Server> => {
  app.use(bodyParserMiddleware);

  app.use(APP_ROUTES.BLOGS, blogRouter);
  app.use(APP_ROUTES.POSTS, postRouter);
  app.use(APP_ROUTES.COMMENTS, commentRouter);
  app.use(APP_ROUTES.USERS, userRouter);
  app.use(APP_ROUTES.AUTH, authRouter);
  app.use(APP_ROUTES.TESTING, testRouter);

  app.use(globalErrorMiddleware);

  return new Promise((resolve, reject) => {
    const server = app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      resolve(server);
    });

    server.on('error', reject);
  });
};
