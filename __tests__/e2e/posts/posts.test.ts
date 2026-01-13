import { Server } from 'http';

import express from 'express';
import request from 'supertest';

import { APP_ROUTES, HTTP_STATUSES } from '../../../src/core/constants';
import { SETTINGS } from '../../../src/core/settings';
import { ERROR_FIELD_MESSAGES } from '../../../src/core/utils';
import { initApp } from '../../../src/init-app';
import { PostInputDTO } from '../../../src/posts/types/post';

import { BlogInputDTO } from './../../../src/blogs/types/blog';

const mockBlog: BlogInputDTO = {
  name: 'New blog',
  description: 'Blog description',
  websiteUrl: 'https://google.com',
};

const mockPost: PostInputDTO = {
  blogId: '1',
  title: 'New post',
  shortDescription: 'Short description',
  content: 'Post content',
};

const mockUpdatedPost: PostInputDTO = {
  blogId: '1',
  title: 'Updated post',
  shortDescription: 'Updated short description',
  content: 'Updated content',
};

describe('Posts', () => {
  const app = express();
  let server: Server;

  const authToken = SETTINGS.AUTH_TOKEN ?? '';

  beforeAll(async () => {
    server = await initApp(app);
  });

  beforeEach(async () => {
    await request(app).delete(`${APP_ROUTES.TESTING}${APP_ROUTES.CLEAR_DATA}`);

    await request(app).post(`${APP_ROUTES.BLOGS}`).set('Authorization', authToken).send(mockBlog);
  });

  afterAll(() => {
    server.close();
  });

  const createPost = async () => {
    const { body } = await request(app)
      .post(`${APP_ROUTES.POSTS}`)
      .set('Authorization', authToken)
      .send(mockPost);

    return body;
  };

  describe('GET /posts', () => {
    it('should return 200 status and array of posts', async () => {
      await request(app).get(`${APP_ROUTES.POSTS}`).expect(HTTP_STATUSES.OK).expect([]);
    });
  });

  describe('POST /posts', () => {
    it('should return 401 status', async () => {
      await request(app)
        .post(`${APP_ROUTES.POSTS}`)
        .send(mockPost)
        .expect(HTTP_STATUSES.UNAUTHORIZED);

      await request(app).get(`${APP_ROUTES.POSTS}`).expect(HTTP_STATUSES.OK).expect([]);
    });

    it('should return 400 status if blog id not exist', async () => {
      await request(app)
        .post(`${APP_ROUTES.POSTS}`)
        .set('Authorization', authToken)
        .send({ ...mockPost, blogId: '100' })
        .expect(HTTP_STATUSES.BAD_REQUEST);

      await request(app).get(`${APP_ROUTES.POSTS}`).expect(HTTP_STATUSES.OK).expect([]);
    });

    it('should return 201 status and created post', async () => {
      const { body: createdPost } = await request(app)
        .post(`${APP_ROUTES.POSTS}`)
        .set('Authorization', authToken)
        .send(mockPost)
        .expect(HTTP_STATUSES.CREATED)
        .expect({ id: '1', blogName: mockBlog.name, ...mockPost });

      await request(app).get(`${APP_ROUTES.POSTS}`).expect(HTTP_STATUSES.OK).expect([createdPost]);
      await request(app).get(`${APP_ROUTES.POSTS}/1`).expect(HTTP_STATUSES.OK).expect(createdPost);
    });

    it('should return 400 status with errors', async () => {
      await request(app)
        .post(`${APP_ROUTES.POSTS}`)
        .set('Authorization', authToken)
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

      await request(app).get(`${APP_ROUTES.POSTS}`).expect(HTTP_STATUSES.OK).expect([]);
    });
  });

  describe('PUT /posts:id', () => {
    it('should return 401 status', async () => {
      await request(app)
        .put(`${APP_ROUTES.POSTS}/1`)
        .send(mockPost)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return 400 status send incorrect id', async () => {
      await request(app)
        .put(`${APP_ROUTES.POSTS}/null`)
        .set('Authorization', authToken)
        .send(mockUpdatedPost)
        .expect(HTTP_STATUSES.BAD_REQUEST);

      await request(app).get(`${APP_ROUTES.POSTS}`).expect(HTTP_STATUSES.OK).expect([]);
    });

    it('should return 404 status if post not found', async () => {
      await request(app)
        .put(`${APP_ROUTES.POSTS}/100`)
        .set('Authorization', authToken)
        .send(mockUpdatedPost)
        .expect(HTTP_STATUSES.NOT_FOUND);

      await request(app).get(`${APP_ROUTES.POSTS}`).expect(HTTP_STATUSES.OK).expect([]);
    });

    it('should return 400 status if send incorrect data', async () => {
      const createdPost = await createPost();

      await request(app)
        .put(`${APP_ROUTES.POSTS}/1`)
        .set('Authorization', authToken)
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

      await request(app).get(`${APP_ROUTES.POSTS}`).expect(HTTP_STATUSES.OK).expect([createdPost]);
    });

    it('should return 204 status', async () => {
      const createdPost = await createPost();

      await request(app)
        .put(`${APP_ROUTES.POSTS}/1`)
        .set('Authorization', authToken)
        .send(mockUpdatedPost)
        .expect(HTTP_STATUSES.NO_CONTENT);

      const updatedBlog = { ...createdPost, ...mockUpdatedPost };

      await request(app).get(`${APP_ROUTES.POSTS}`).expect(HTTP_STATUSES.OK).expect([updatedBlog]);
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should return 401 status', async () => {
      await request(app).delete(`${APP_ROUTES.POSTS}/1`).expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return 400 status if send incorrect id', async () => {
      const createdPost = await createPost();

      await request(app)
        .delete(`${APP_ROUTES.POSTS}/null`)
        .set('Authorization', authToken)
        .expect(HTTP_STATUSES.BAD_REQUEST);

      await request(app).get(`${APP_ROUTES.POSTS}`).expect(HTTP_STATUSES.OK).expect([createdPost]);
    });

    it('should return 404 status if post id not exist', async () => {
      await request(app)
        .delete(`${APP_ROUTES.POSTS}/100`)
        .set('Authorization', authToken)
        .expect(HTTP_STATUSES.NOT_FOUND);

      await request(app).get(`${APP_ROUTES.POSTS}`).expect(HTTP_STATUSES.OK).expect([]);
    });

    it('should return 204 status', async () => {
      const createdPost = await createPost();

      await request(app).get(`${APP_ROUTES.POSTS}`).expect(HTTP_STATUSES.OK).expect([createdPost]);

      await request(app)
        .delete(`${APP_ROUTES.POSTS}/1`)
        .set('Authorization', authToken)
        .expect(HTTP_STATUSES.NO_CONTENT);

      await request(app).get(`${APP_ROUTES.POSTS}`).expect(HTTP_STATUSES.OK).expect([]);
    });
  });
});
