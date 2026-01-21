import { Server } from 'http';

import { Express } from 'express';

import { blogRouter } from './blogs/router/blog.router';
import { APP_ROUTES } from './core/constants';
import { bodyParserMiddleware } from './core/middleware';
import { postRouter } from './posts/router/posts.router';
import { testRouter } from './tests/router/test.router';

const PORT = process.env.PORT || 5000;

export const initApp = (app: Express): Promise<Server> => {
  app.use(bodyParserMiddleware);

  app.use(APP_ROUTES.BLOGS, blogRouter);
  app.use(APP_ROUTES.POSTS, postRouter);
  app.use(APP_ROUTES.TESTING, testRouter);

  return new Promise((resolve, reject) => {
    const server = app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      resolve(server);
    });

    server.on('error', reject);
  });
};
