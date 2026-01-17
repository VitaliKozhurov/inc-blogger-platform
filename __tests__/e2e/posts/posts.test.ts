import { ObjectId } from 'mongodb';

import { APP_ROUTES, HTTP_STATUSES, PARAM_ID_ERROR_MESSAGES } from '../../../src/core/constants';
import { ERROR_FIELD_MESSAGES } from '../../../src/core/utils';
import { PostsResponseType } from '../../../src/posts/router/mappers/map-to-post-list-view-model';
import { createPost } from '../../utils/posts/createPost';
import { TestManager } from '../../utils/test-manager';

import { mockPost, mockUpdatedPost } from './mock';

describe('Posts', () => {
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

  describe('GET /posts', () => {
    it('should return a 200 status code with an empty array when no posts are available', async () => {
      const { body }: { body: PostsResponseType } = await testManager.context
        .request()
        .get(`${APP_ROUTES.POSTS}`)
        .expect(HTTP_STATUSES.OK);

      expect(body.items).toHaveLength(0);
      expect(body.totalCount).toBe(0);
    });

    it('should return a 200 status code with the created post after a successful creation', async () => {
      await createPost(testManager);

      const { body }: { body: PostsResponseType } = await testManager.context
        .request()
        .get(`${APP_ROUTES.POSTS}`)
        .expect(HTTP_STATUSES.OK);

      expect(body.items).toHaveLength(1);
      expect(body.pagesCount).toBe(1);
      expect(body.totalCount).toBe(1);
    });

    it('should return a 400 status code with errors if query params is incorrect', async () => {
      const { body } = await testManager.context
        .request()
        .get(`${APP_ROUTES.POSTS}?sortBy=price&sortDirection=ASC&pageNumber=o&pageSize=o`)
        .expect(HTTP_STATUSES.BAD_REQUEST);

      expect(body.errorsMessages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'pageNumber', message: expect.any(String) }),
          expect.objectContaining({ field: 'pageSize', message: expect.any(String) }),
          expect.objectContaining({ field: 'sortBy', message: expect.any(String) }),
          expect.objectContaining({ field: 'sortDirection', message: expect.any(String) }),
        ])
      );
    });
  });

  describe('GET /posts/:id', () => {
    it('should return 200 status code with created post', async () => {
      const createdPost = await createPost(testManager);

      await testManager.context
        .request()
        .get(`${APP_ROUTES.POSTS}/${createdPost.id}`)
        .expect(HTTP_STATUSES.OK)
        .expect(createdPost);
    });

    it('should return 404 status code if request with not existing post id', async () => {
      const id = new ObjectId().toHexString();

      await testManager.context
        .request()
        .get(`${APP_ROUTES.POSTS}/${id}`)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });

    it('should return 400 status code if request with incorrect post id', async () => {
      await testManager.context
        .request()
        .get(`${APP_ROUTES.POSTS}/${null}`)
        .expect(HTTP_STATUSES.BAD_REQUEST)
        .expect({
          errorsMessages: [{ field: 'id', message: PARAM_ID_ERROR_MESSAGES.MUST_BE_OBJECT_ID }],
        });
    });
  });

  describe('POST /posts', () => {
    it('should return 401 status code if token invalid', async () => {
      await testManager.context
        .request()
        .post(`${APP_ROUTES.POSTS}`)
        .send(mockPost)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return 400 status code if blog not exist', async () => {
      const blogId = new ObjectId().toHexString();

      await testManager.context
        .request()
        .post(`${APP_ROUTES.POSTS}`)
        .set('Authorization', testManager.authToken)
        .send({ ...mockPost, blogId })
        .expect(HTTP_STATUSES.NOT_FOUND);
    });

    it('should return 400 status code with validation errors', async () => {
      await testManager.context
        .request()
        .post(`${APP_ROUTES.POSTS}`)
        .set('Authorization', testManager.authToken)
        .send({})
        .expect(HTTP_STATUSES.BAD_REQUEST)
        .expect({
          errorsMessages: [
            { field: 'blogId', message: ERROR_FIELD_MESSAGES.REQUIRED('blogId') },
            { field: 'title', message: ERROR_FIELD_MESSAGES.REQUIRED('title') },
            {
              field: 'shortDescription',
              message: ERROR_FIELD_MESSAGES.REQUIRED('shortDescription'),
            },
            { field: 'content', message: ERROR_FIELD_MESSAGES.REQUIRED('content') },
          ],
        });
    });

    it('should return 201 status code and created post', async () => {
      const createdPost = await createPost(testManager);

      await testManager.context
        .request()
        .get(`${APP_ROUTES.POSTS}/${createdPost.id}`)
        .expect(HTTP_STATUSES.OK)
        .expect(createdPost);
    });
  });

  describe('PUT /posts:id', () => {
    it('should return 401 status code if token invalid', async () => {
      await testManager.context
        .request()
        .put(`${APP_ROUTES.POSTS}/1`)
        .send(mockPost)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return 400 status code if post id incorrect', async () => {
      await testManager.context
        .request()
        .put(`${APP_ROUTES.POSTS}/null`)
        .set('Authorization', testManager.authToken)
        .send(mockUpdatedPost)
        .expect(HTTP_STATUSES.BAD_REQUEST);
    });

    it('should return 404 status if post not exist', async () => {
      const id = new ObjectId().toHexString();
      const blogId = new ObjectId().toHexString();

      await testManager.context
        .request()
        .put(`${APP_ROUTES.POSTS}/${id}`)
        .set('Authorization', testManager.authToken)
        .send({ ...mockUpdatedPost, blogId })
        .expect(HTTP_STATUSES.NOT_FOUND);
    });

    it('should return 400 status code if request data incorrect', async () => {
      const createdPost = await createPost(testManager);

      await testManager.context
        .request()
        .put(`${APP_ROUTES.POSTS}/${createdPost.id}`)
        .set('Authorization', testManager.authToken)
        .send({})
        .expect(HTTP_STATUSES.BAD_REQUEST)
        .expect({
          errorsMessages: [
            { field: 'blogId', message: ERROR_FIELD_MESSAGES.REQUIRED('blogId') },
            { field: 'title', message: ERROR_FIELD_MESSAGES.REQUIRED('title') },
            {
              field: 'shortDescription',
              message: ERROR_FIELD_MESSAGES.REQUIRED('shortDescription'),
            },
            { field: 'content', message: ERROR_FIELD_MESSAGES.REQUIRED('content') },
          ],
        });
    });

    it('should return 204 status code after request with correct post data', async () => {
      const createdPost = await createPost(testManager);

      await testManager.context
        .request()
        .put(`${APP_ROUTES.POSTS}/${createdPost.id}`)
        .set('Authorization', testManager.authToken)
        .send({ ...mockUpdatedPost, blogId: createdPost.blogId })
        .expect(HTTP_STATUSES.NO_CONTENT);
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should return 401 status code if token invalid', async () => {
      await testManager.context
        .request()
        .delete(`${APP_ROUTES.POSTS}/1`)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return 400 status code if incorrect post id', async () => {
      await testManager.context
        .request()
        .delete(`${APP_ROUTES.POSTS}/null`)
        .set('Authorization', testManager.authToken)
        .expect(HTTP_STATUSES.BAD_REQUEST);
    });

    it('should return 404 status code if post not exist', async () => {
      const id = new ObjectId().toHexString();

      await testManager.context
        .request()
        .delete(`${APP_ROUTES.POSTS}/${id}`)
        .set('Authorization', testManager.authToken)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });

    it('should return 204 status code if request with correct post id', async () => {
      const createdPost = await createPost(testManager);

      await testManager.context
        .request()
        .delete(`${APP_ROUTES.POSTS}/${createdPost.id}`)
        .set('Authorization', testManager.authToken)
        .expect(HTTP_STATUSES.NO_CONTENT);

      await testManager.context
        .request()
        .get(`${APP_ROUTES.POSTS}/${createdPost.id}`)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });
  });
});
