import { Express } from 'express';
import request from 'supertest';

import { BlogViewModelType } from '../../../src/blogs/types/blog';
import { APP_ROUTES, HTTP_STATUSES } from '../../../src/core/constants';
import { mockBlog } from '../../e2e/blogs/mock';
import { getAuthToken } from '../get-auth-token';

export const createBlog = async (app: Express): Promise<BlogViewModelType> => {
  const authToken = getAuthToken();

  const { body } = await request(app)
    .post(`${APP_ROUTES.BLOGS}`)
    .set('Authorization', authToken)
    .send(mockBlog)
    .expect(HTTP_STATUSES.CREATED);

  return body;
};
