import { ObjectId } from 'mongodb';

import { BlogViewModelType } from '../../../src/blogs/types';
import { APP_ROUTES, HTTP_STATUSES, PARAM_ID_ERROR_MESSAGES } from '../../../src/core/constants';
import { ResponseWithPaginationType } from '../../../src/core/types';
import { ERROR_FIELD_MESSAGES } from '../../../src/core/utils';
import { PostViewModelType } from '../../../src/posts/types';
import { createBlog } from '../../utils/blogs/create-blog';
import { mockBlog, mockUpdatedBlog } from '../../utils/blogs/mock';
import { createPost } from '../../utils/posts/createPost';
import { mockPost } from '../../utils/posts/mock';
import { TestManager } from '../../utils/test-manager';

type BlogsResponseType = ResponseWithPaginationType<BlogViewModelType>;
type PostsResponseType = ResponseWithPaginationType<PostViewModelType>;

describe('Blogs test', () => {
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

  describe('GET /blogs', () => {
    it('should return a 200 status code with an empty array when no blogs are available', async () => {
      const { body }: { body: BlogsResponseType } = await testManager.context
        .request()
        .get(`${APP_ROUTES.BLOGS}`)
        .expect(HTTP_STATUSES.OK);

      expect(body.items).toHaveLength(0);
      expect(body.totalCount).toBe(0);
    });

    it('should return a 200 status code with the created blog after a successful creation', async () => {
      await createBlog(testManager);

      const { body }: { body: BlogsResponseType } = await testManager.context
        .request()
        .get(`${APP_ROUTES.BLOGS}`)
        .expect(HTTP_STATUSES.OK);

      expect(body.items).toHaveLength(1);
      expect(body.pagesCount).toBe(1);
      expect(body.totalCount).toBe(1);
    });

    it('should return a 400 status code with errors if query params is incorrect', async () => {
      const { body } = await testManager.context
        .request()
        .get(`${APP_ROUTES.BLOGS}?sortBy=price&sortDirection=ASC&pageNumber=o&pageSize=o`)
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

  describe('GET /blogs/:id', () => {
    it('should return 200 status code with created blog', async () => {
      const createdBlog = await createBlog(testManager);

      await testManager.context
        .request()
        .get(`${APP_ROUTES.BLOGS}/${createdBlog.id}`)
        .expect(HTTP_STATUSES.OK)
        .expect(createdBlog);
    });

    it('should return 404 status code if request with not existing blog id', async () => {
      const id = new ObjectId().toHexString();

      await testManager.context
        .request()
        .get(`${APP_ROUTES.BLOGS}/${id}`)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });

    it('should return 400 status code if request with incorrect blog id', async () => {
      await testManager.context
        .request()
        .get(`${APP_ROUTES.BLOGS}/${null}`)
        .expect(HTTP_STATUSES.BAD_REQUEST)
        .expect({
          errorsMessages: [{ field: 'id', message: PARAM_ID_ERROR_MESSAGES.MUST_BE_OBJECT_ID }],
        });
    });
  });

  describe('POST /blogs', () => {
    it('should return 401 status code if token invalid', async () => {
      await testManager.context
        .request()
        .post(`${APP_ROUTES.BLOGS}`)
        .send(mockBlog)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return 400 status code with validation errors', async () => {
      await testManager.context
        .request()
        .post(`${APP_ROUTES.BLOGS}`)
        .set('Authorization', testManager.authToken)
        .send({})
        .expect(HTTP_STATUSES.BAD_REQUEST)
        .expect({
          errorsMessages: [
            { field: 'name', message: ERROR_FIELD_MESSAGES.REQUIRED('name') },
            { field: 'description', message: ERROR_FIELD_MESSAGES.REQUIRED('description') },
            { field: 'websiteUrl', message: ERROR_FIELD_MESSAGES.REQUIRED('websiteUrl') },
          ],
        });
    });

    it('should return 201 status code and created blog', async () => {
      const createdBlog = await createBlog(testManager);

      expect(createdBlog).toHaveProperty('id');

      await testManager.context.request().get(`${APP_ROUTES.BLOGS}`).expect(HTTP_STATUSES.OK);
    });
  });

  describe('PUT /blogs:id', () => {
    it('should return 401 status code if token invalid', async () => {
      await testManager.context
        .request()
        .put(`${APP_ROUTES.BLOGS}/1`)
        .send(mockUpdatedBlog)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return 400 status code if blog id incorrect', async () => {
      await testManager.context
        .request()
        .put(`${APP_ROUTES.BLOGS}/null`)
        .set('Authorization', testManager.authToken)
        .send(mockUpdatedBlog)
        .expect(HTTP_STATUSES.BAD_REQUEST);
    });

    it('should return 404 status code if blog not exist', async () => {
      const id = new ObjectId().toHexString();

      await testManager.context
        .request()
        .put(`${APP_ROUTES.BLOGS}/${id}`)
        .set('Authorization', testManager.authToken)
        .send(mockUpdatedBlog)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });

    it('should return 400 status code if request data incorrect', async () => {
      const createdBlog = await createBlog(testManager);

      await testManager.context
        .request()
        .put(`${APP_ROUTES.BLOGS}/${createdBlog.id}`)
        .set('Authorization', testManager.authToken)
        .send({})
        .expect(HTTP_STATUSES.BAD_REQUEST)
        .expect({
          errorsMessages: [
            { field: 'name', message: ERROR_FIELD_MESSAGES.REQUIRED('name') },
            { field: 'description', message: ERROR_FIELD_MESSAGES.REQUIRED('description') },
            { field: 'websiteUrl', message: ERROR_FIELD_MESSAGES.REQUIRED('websiteUrl') },
          ],
        });
    });

    it('should return 204 status code after request with correct blog data', async () => {
      const createdBlog = await createBlog(testManager);

      await testManager.context
        .request()
        .put(`${APP_ROUTES.BLOGS}/${createdBlog.id}`)
        .set('Authorization', testManager.authToken)
        .send(mockUpdatedBlog)
        .expect(HTTP_STATUSES.NO_CONTENT);
    });
  });

  describe('DELETE /blogs/:id', () => {
    it('should return 401 status code if token invalid', async () => {
      await testManager.context
        .request()
        .delete(`${APP_ROUTES.BLOGS}/1`)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return 400 status code if incorrect blog id', async () => {
      await testManager.context
        .request()
        .delete(`${APP_ROUTES.BLOGS}/null`)
        .set('Authorization', testManager.authToken)
        .expect(HTTP_STATUSES.BAD_REQUEST);
    });

    it('should return 404 status code if blog not exist', async () => {
      const id = new ObjectId().toHexString();

      await testManager.context
        .request()
        .delete(`${APP_ROUTES.BLOGS}/${id}`)
        .set('Authorization', testManager.authToken)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });

    it('should return 204 status code if request with correct blog id', async () => {
      const createdBlog = await createBlog(testManager);

      await testManager.context
        .request()
        .delete(`${APP_ROUTES.BLOGS}/${createdBlog.id}`)
        .set('Authorization', testManager.authToken)
        .expect(HTTP_STATUSES.NO_CONTENT);

      await testManager.context
        .request()
        .get(`${APP_ROUTES.BLOGS}/${createdBlog.id}`)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });
  });

  describe('GET /blogs/:id/posts', () => {
    it('should return 200 status code with created blog', async () => {
      const createdPost = await createPost(testManager);

      const { body }: { body: PostsResponseType } = await testManager.context
        .request()
        .get(`${APP_ROUTES.BLOGS}/${createdPost.blogId}${APP_ROUTES.POSTS}`)
        .expect(HTTP_STATUSES.OK);

      expect(body.items).toHaveLength(1);
      expect(body.items[0]).toEqual(createdPost);
    });

    it('should return 404 status code if request with not existing blog id', async () => {
      const id = new ObjectId().toHexString();

      await testManager.context
        .request()
        .get(`${APP_ROUTES.BLOGS}/${id}${APP_ROUTES.POSTS}`)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });

    it('should return 400 status code if request with incorrect blog id', async () => {
      await testManager.context
        .request()
        .get(`${APP_ROUTES.BLOGS}/${null}${APP_ROUTES.POSTS}`)
        .expect(HTTP_STATUSES.BAD_REQUEST)
        .expect({
          errorsMessages: [{ field: 'id', message: PARAM_ID_ERROR_MESSAGES.MUST_BE_OBJECT_ID }],
        });
    });
  });

  describe('POST /blogs/:id/posts', () => {
    it('should return 200 status code with created post', async () => {
      const createdBlog = await createBlog(testManager);

      await testManager.context
        .request()
        .post(`${APP_ROUTES.BLOGS}/${createdBlog.id}${APP_ROUTES.POSTS}`)
        .set('Authorization', testManager.authToken)
        .send(mockPost)
        .expect(HTTP_STATUSES.CREATED);

      const { body }: { body: PostsResponseType } = await testManager.context
        .request()
        .get(`${APP_ROUTES.BLOGS}/${createdBlog.id}${APP_ROUTES.POSTS}`)
        .expect(HTTP_STATUSES.OK);

      expect(body.items).toHaveLength(1);
    });

    it('should return 404 status code if request with not existing blog id', async () => {
      const id = new ObjectId().toHexString();

      await testManager.context
        .request()
        .post(`${APP_ROUTES.BLOGS}/${id}${APP_ROUTES.POSTS}`)
        .set('Authorization', testManager.authToken)
        .send(mockPost)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });

    it('should return 400 status code if request with incorrect blog id', async () => {
      await testManager.context
        .request()
        .post(`${APP_ROUTES.BLOGS}/${null}${APP_ROUTES.POSTS}`)
        .set('Authorization', testManager.authToken)
        .expect(HTTP_STATUSES.BAD_REQUEST)
        .send(mockPost)
        .expect({
          errorsMessages: [{ field: 'id', message: PARAM_ID_ERROR_MESSAGES.MUST_BE_OBJECT_ID }],
        });
    });
  });
});
