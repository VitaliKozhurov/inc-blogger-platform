import { APP_ROUTES } from '../../../src/core/constants';
import { HTTP_STATUSES } from '../../../src/core/types';
import { PostViewModelType } from '../../../src/posts/types';
import { createBlog } from '../blogs/create-blog';
import { TestManager } from '../test-manager';

import { mockPost } from './mock';

export const createPost = async (testManager: TestManager): Promise<PostViewModelType> => {
  const { id } = await createBlog(testManager);

  const { body } = await testManager.context
    .request()
    .post(`${APP_ROUTES.POSTS}`)
    .set('Authorization', testManager.authToken)
    .send({ ...mockPost, blogId: id })
    .expect(HTTP_STATUSES.CREATED);

  return body;
};
