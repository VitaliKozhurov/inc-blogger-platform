import { APP_ROUTES } from '../../../src/core/constants';
import { HTTP_STATUSES } from '../../../src/core/types';
import { PostViewModelDTO } from '../../../src/modules/posts/dto/post-view-model.dto';
import { createBlog } from '../blogs/create-blog';
import { TestManager } from '../test-manager';

import { mockPost } from './mock';

export const createPost = async (testManager: TestManager): Promise<PostViewModelDTO> => {
  const { id } = await createBlog(testManager);

  const { body } = await testManager.context
    .request()
    .post(`${APP_ROUTES.POSTS}`)
    .set('Authorization', testManager.authToken)
    .send({ ...mockPost, blogId: id })
    .expect(HTTP_STATUSES.CREATED);

  return body;
};
