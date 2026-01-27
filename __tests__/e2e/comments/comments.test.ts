import { APP_ROUTES } from '../../../src/core/constants';
import { HTTP_STATUSES, ResponseWithPaginationType } from '../../../src/core/types';
import { UserViewModelType } from '../../../src/users/types';
import { TestManager } from '../../utils/test-manager';
import { createUser } from '../../utils/users/create-user';
import { mockUser } from '../../utils/users/mock';

import { createPost } from './../../utils/posts/createPost';

type UsersResponseType = ResponseWithPaginationType<UserViewModelType>;

describe('Comments test', () => {
  const testManager = new TestManager();

  beforeAll(async () => {
    await testManager.init();
  });

  beforeEach(async () => {
    await testManager.clearDb();
  });

  afterAll(async () => {
    await testManager.close();
  });

  describe('POST /posts/:id/comments', () => {
    it('should return 401 status code if token invalid', async () => {
      const createdUser = await createUser(testManager);
      const createdPost = await createPost(testManager);

      const { body } = await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_LOGIN}`)
        .send({ loginOrEmail: createdUser.login, password: mockUser.password });

      await testManager.context
        .request()
        .post(`${APP_ROUTES.POSTS}/${createdPost.id}${APP_ROUTES.COMMENTS}`)
        .set('Authorization', `Bearer ${body.accessToken}`)
        .send({ content: 'dlkfkj' })
        .expect(HTTP_STATUSES.CREATED);
    });
  });
});
