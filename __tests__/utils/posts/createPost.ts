import { APP_ROUTES, HTTP_STATUSES } from '../../../src/core/constants';
import { PostViewModelType } from '../../../src/posts/types';
import { mockPost } from '../../e2e/posts/mock';
import { createBlog } from '../blogs/create-blog';
import { TestManager } from '../test-manager';

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
