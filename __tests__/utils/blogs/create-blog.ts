import { BlogViewModelType } from '../../../src/blogs/types';
import { APP_ROUTES } from '../../../src/core/constants';
import { HTTP_STATUSES } from '../../../src/core/types';
import { TestManager } from '../test-manager';

import { mockBlog } from './mock';

export const createBlog = async (testManager: TestManager): Promise<BlogViewModelType> => {
  const { body } = await testManager.context
    .request()
    .post(`${APP_ROUTES.BLOGS}`)
    .set('Authorization', testManager.authToken)
    .send(mockBlog)
    .expect(HTTP_STATUSES.CREATED);

  return body;
};
