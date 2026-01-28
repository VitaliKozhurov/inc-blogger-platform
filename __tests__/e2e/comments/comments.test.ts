import { ObjectId } from 'mongodb';

import { CommentViewModelType } from '../../../src/comments/types';
import { APP_ROUTES } from '../../../src/core/constants';
import { HTTP_STATUSES, ResponseWithPaginationType } from '../../../src/core/types';
import { mockComment } from '../../utils/comments/mock';
import { createPost } from '../../utils/posts/create-post';
import { TestManager } from '../../utils/test-manager';
import { createUser } from '../../utils/users/create-user';
import { loginUser } from '../../utils/users/login-user';
import { mockUser } from '../../utils/users/mock';

type CommentsResponseType = ResponseWithPaginationType<CommentViewModelType>;

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

  describe('GET /comments/:id', () => {
    it('should return 404 status code if post not exist', async () => {
      const fakePostId = new ObjectId().toString();

      await testManager.context
        .request()
        .get(`${APP_ROUTES.POSTS}/${fakePostId}`)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });

    it('should return 200 status code with comment', async () => {
      const createdPost = await createPost(testManager);
      const accessToken = await loginUser(testManager);

      const createdComment = await testManager.context
        .request()
        .post(`${APP_ROUTES.POSTS}/${createdPost.id}${APP_ROUTES.COMMENTS}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(mockComment);

      console.log(createdComment.body);

      await testManager.context
        .request()
        .get(`${APP_ROUTES.COMMENTS}/${createdComment.body.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(mockComment)
        .expect(HTTP_STATUSES.OK);
    });
  });

  describe.skip('POST /posts/:id/comments', () => {
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

// it('should return 401 status code if access token invalid', async () => {
//       const createdPost = await createPost(testManager);

// await testManager.context
//   .request()
//   .post(`${APP_ROUTES.POSTS}/${createdPost.id}${APP_ROUTES.COMMENTS}`)
//   .set('Authorization', `Bearer invalid_token`)
//   .send(mockComment)
//   .expect(HTTP_STATUSES.UNAUTHORIZED);
//     });
