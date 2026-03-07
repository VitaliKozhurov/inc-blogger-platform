import { Server } from 'http';

import cookieParser from 'cookie-parser';
import { Express } from 'express';

import { APP_ROUTES } from './core/constants';
import { bodyParserMiddleware, globalErrorMiddleware } from './core/middleware';
import { authRouter } from './modules/auth';
import { blogRouter } from './modules/blogs';
import { commentRouter } from './modules/comments';
import { postRouter } from './modules/posts';
import { userDeviceSessionRouter } from './modules/user-device-session';
import { usersRouter } from './modules/users';
import { testRouter } from './tests/router/test.router';
const PORT = process.env.PORT || 5000;

export const initApp = (app: Express): Promise<Server> => {
  app.set('trust proxy', true);
  app.use(bodyParserMiddleware);
  app.use(cookieParser());

  app.use(APP_ROUTES.BLOGS, blogRouter);
  app.use(APP_ROUTES.POSTS, postRouter);
  app.use(APP_ROUTES.COMMENTS, commentRouter);
  app.use(APP_ROUTES.USERS, usersRouter);
  app.use(APP_ROUTES.AUTH, authRouter);
  app.use(APP_ROUTES.SECURITY, userDeviceSessionRouter);
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
