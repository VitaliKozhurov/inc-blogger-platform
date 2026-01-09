import express from 'express';

import { blogRouter } from './blogs/router/blog.router';
import { APP_ROUTES } from './core/constants';
import { bodyParserMiddleware } from './core/middleware';
import { postRouter } from './posts/router/posts.router';
import { testRouter } from './tests/router/test.router';

const PORT = 5000;

const app = express();

app.use(bodyParserMiddleware);

app.use(APP_ROUTES.BLOGS, blogRouter);
app.use(APP_ROUTES.POSTS, postRouter);
app.use(APP_ROUTES.TESTING, testRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
