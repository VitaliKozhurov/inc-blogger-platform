import { Express } from 'express';
import request from 'supertest';

import { APP_ROUTES, HTTP_STATUSES } from '../../../src/core/constants';
import { PostViewModelType } from '../../../src/posts/types/post';
import { mockPost } from '../../e2e/posts/mock';
import { createBlog } from '../blogs/createBlog';
import { getAuthToken } from '../get-auth-token';

export const createPost = async (app: Express): Promise<PostViewModelType> => {
  const authToken = getAuthToken();

  const blog = await createBlog(app);

  const { body } = await request(app)
    .post(`${APP_ROUTES.POSTS}`)
    .set('Authorization', authToken)
    .send({ ...mockPost, blogId: blog.id })
    .expect(HTTP_STATUSES.CREATED);

  return body;
};
