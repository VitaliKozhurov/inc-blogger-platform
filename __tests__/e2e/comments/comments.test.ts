import { ObjectId } from 'mongodb';

import { jwtAdapter } from '../../../src/auth/adapters';
import { CommentViewModelType } from '../../../src/comments/types';
import { APP_ROUTES } from '../../../src/core/constants';
import { HTTP_STATUSES, ResponseWithPaginationType } from '../../../src/core/types';
import { mockComment } from '../../utils/comments/mock';
import { createPost } from '../../utils/posts/create-post';
import { TestManager } from '../../utils/test-manager';
import { loginUser } from '../../utils/users/login-user';

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

      await testManager.context
        .request()
        .get(`${APP_ROUTES.COMMENTS}/${createdComment.body.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(mockComment)
        .expect(HTTP_STATUSES.OK);
    });
  });

  describe('PUT /comments/:id', () => {
    it('should return 401 status code if incorrect access token', async () => {
      const fakePostId = new ObjectId().toString();

      await testManager.context
        .request()
        .put(`${APP_ROUTES.COMMENTS}/${fakePostId}`)
        .set('Authorization', `Bearer ${'incorrect token'}`)
        .send(mockComment)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return 400 status code if incorrect payload data', async () => {
      const createdPost = await createPost(testManager);
      const accessToken = await loginUser(testManager);

      const createdComment = await testManager.context
        .request()
        .post(`${APP_ROUTES.POSTS}/${createdPost.id}${APP_ROUTES.COMMENTS}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(mockComment);

      await testManager.context
        .request()
        .put(`${APP_ROUTES.COMMENTS}/${createdComment.body.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'small content' })
        .expect(HTTP_STATUSES.BAD_REQUEST);
    });

    it('should return 403 status code if do not have permissions', async () => {
      const createdPost = await createPost(testManager);
      const accessToken = await loginUser(testManager);

      const createdComment = await testManager.context
        .request()
        .post(`${APP_ROUTES.POSTS}/${createdPost.id}${APP_ROUTES.COMMENTS}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(mockComment);

      const token = jwtAdapter.createJWT({ userId: 'random' });

      await testManager.context
        .request()
        .put(`${APP_ROUTES.COMMENTS}/${createdComment.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(mockComment)
        .expect(HTTP_STATUSES.FORBIDDEN);
    });

    it('should return 404 status code if incorrect comment id', async () => {
      const fakeCommentId = new ObjectId().toString();
      const accessToken = await loginUser(testManager);

      await testManager.context
        .request()
        .put(`${APP_ROUTES.COMMENTS}/${fakeCommentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(mockComment)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });
  });

  describe('DELETE /comments/:id', () => {
    it('should return 401 status code if token invalid', async () => {
      const fakeCommentId = new ObjectId().toString();

      await testManager.context
        .request()
        .delete(`${APP_ROUTES.COMMENTS}/${fakeCommentId}`)
        .set('Authorization', `Bearer ${'invalid_token'}`)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return 403 status code if do not have permissions', async () => {
      const createdPost = await createPost(testManager);
      const accessToken = await loginUser(testManager);

      const createdComment = await testManager.context
        .request()
        .post(`${APP_ROUTES.POSTS}/${createdPost.id}${APP_ROUTES.COMMENTS}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(mockComment);

      const incorrectToken = jwtAdapter.createJWT({ userId: 'incorrect user' });

      await testManager.context
        .request()
        .delete(`${APP_ROUTES.COMMENTS}/${createdComment.body.id}`)
        .set('Authorization', `Bearer ${incorrectToken}`)
        .expect(HTTP_STATUSES.FORBIDDEN);
    });

    it('should return 404 status code if incorrect comment id', async () => {
      const fakeCommentId = new ObjectId().toString();
      const accessToken = await loginUser(testManager);

      await testManager.context
        .request()
        .delete(`${APP_ROUTES.COMMENTS}/${fakeCommentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });

    it('should return 204 status code', async () => {
      const createdPost = await createPost(testManager);

      const accessToken = await loginUser(testManager);

      const createdComment = await testManager.context
        .request()
        .post(`${APP_ROUTES.POSTS}/${createdPost.id}${APP_ROUTES.COMMENTS}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(mockComment);

      await testManager.context
        .request()
        .delete(`${APP_ROUTES.COMMENTS}/${createdComment.body.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HTTP_STATUSES.NO_CONTENT);
    });
  });

  describe('POST /posts/:id/comments', () => {
    it('should return 401 status code if token invalid', async () => {
      const createdPost = await createPost(testManager);

      await testManager.context
        .request()
        .post(`${APP_ROUTES.POSTS}/${createdPost.id}${APP_ROUTES.COMMENTS}`)
        .set('Authorization', `Bearer ${'fake-token'}`)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return 400 status code if invalid payload data', async () => {
      const createdPost = await createPost(testManager);
      const accessToken = await loginUser(testManager);

      await testManager.context
        .request()
        .post(`${APP_ROUTES.POSTS}/${createdPost.id}${APP_ROUTES.COMMENTS}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HTTP_STATUSES.BAD_REQUEST);
    });

    it('should return 404 status code if post not exist', async () => {
      const fakePostId = new ObjectId().toString();
      const accessToken = await loginUser(testManager);

      await testManager.context
        .request()
        .post(`${APP_ROUTES.POSTS}/${fakePostId}${APP_ROUTES.COMMENTS}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(mockComment)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });

    it('should return 201 status code and created comment', async () => {
      const createdPost = await createPost(testManager);
      const accessToken = await loginUser(testManager);

      await testManager.context
        .request()
        .post(`${APP_ROUTES.POSTS}/${createdPost.id}${APP_ROUTES.COMMENTS}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(mockComment)
        .expect(HTTP_STATUSES.CREATED);
    });
  });

  describe('GET /posts/:id/comments', () => {
    it('should return 404 status code if incorrect post id', async () => {
      const fakePostId = new ObjectId().toString();

      await testManager.context
        .request()
        .get(`${APP_ROUTES.POSTS}/${fakePostId}${APP_ROUTES.COMMENTS}`)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });

    it('should return 200 status code with comments', async () => {
      const createdPost = await createPost(testManager);
      const accessToken = await loginUser(testManager);

      const commentData = await testManager.context
        .request()
        .post(`${APP_ROUTES.POSTS}/${createdPost.id}${APP_ROUTES.COMMENTS}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(mockComment);

      const comments = await testManager.context
        .request()
        .get(`${APP_ROUTES.POSTS}/${createdPost.id}${APP_ROUTES.COMMENTS}`)
        .expect(HTTP_STATUSES.OK);

      expect(comments.body.items).toEqual([commentData.body]);
    });
  });
});
