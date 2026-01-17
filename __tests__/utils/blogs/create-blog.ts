import { BlogViewModelType } from '../../../src/blogs/types';
import { APP_ROUTES, HTTP_STATUSES } from '../../../src/core/constants';
import { mockBlog } from '../../e2e/blogs/mock';
import { TestManager } from '../test-manager';

export const createBlog = async (testManager: TestManager): Promise<BlogViewModelType> => {
  const { body } = await testManager.context
    .request()
    .post(`${APP_ROUTES.BLOGS}`)
    .set('Authorization', testManager.authToken)
    .send(mockBlog)
    .expect(HTTP_STATUSES.CREATED);

  return body;
};
