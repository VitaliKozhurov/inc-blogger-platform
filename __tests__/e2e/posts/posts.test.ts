import { Server } from 'http';

import express from 'express';
import { ObjectId } from 'mongodb';
import request from 'supertest';

import { APP_ROUTES, HTTP_STATUSES } from '../../../src/core/constants';
import { ERROR_FIELD_MESSAGES } from '../../../src/core/utils';
import { stopDb } from '../../../src/db';
import { clearDb } from '../../utils/clear-db';
import { getAuthToken } from '../../utils/get-auth-token';
import { createPost } from '../../utils/posts/createPost';
import { setupTestEnvironments } from '../../utils/setup-test-environment';

import { mockPost, mockUpdatedPost } from './mock';

describe('Posts', () => {
  const app = express();
  let server: Server;

  const authToken = getAuthToken();

  beforeAll(async () => {
    server = await setupTestEnvironments(app);
  });

  beforeEach(async () => {
    await clearDb(app);
  });

  afterAll(async () => {
    server.close();
    await stopDb();
  });

  describe('GET /posts', () => {
    it('should return 200 status code and array of posts', async () => {
      await request(app).get(`${APP_ROUTES.POSTS}`).expect(HTTP_STATUSES.OK);
    });
  });

  describe('GET /posts/:id', () => {
    it('should return 200 status and post', async () => {
      const createdPost = await createPost(app);

      await request(app)
        .get(`${APP_ROUTES.POSTS}/${createdPost.id}`)
        .expect(HTTP_STATUSES.OK)
        .expect(createdPost);
    });
  });

  describe('POST /posts', () => {
    it('should return 401 status', async () => {
      await request(app)
        .post(`${APP_ROUTES.POSTS}`)
        .send(mockPost)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return 400 status code if blog id not exist', async () => {
      const blogId = new ObjectId().toHexString();

      await request(app)
        .post(`${APP_ROUTES.POSTS}`)
        .set('Authorization', authToken)
        .send({ ...mockPost, blogId })
        .expect(HTTP_STATUSES.BAD_REQUEST);
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
    });

    it('should return 201 status and created post', async () => {
      const createdPost = await createPost(app);

      await request(app)
        .get(`${APP_ROUTES.POSTS}/${createdPost.id}`)
        .expect(HTTP_STATUSES.OK)
        .expect(createdPost);
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
    });

    it('should return 404 status if post not found', async () => {
      const id = new ObjectId().toHexString();
      const blogId = new ObjectId().toHexString();

      await request(app)
        .put(`${APP_ROUTES.POSTS}/${id}`)
        .set('Authorization', authToken)
        .send({ ...mockUpdatedPost, blogId })
        .expect(HTTP_STATUSES.NOT_FOUND);
    });

    it('should return 400 status if send incorrect data', async () => {
      const createdPost = await createPost(app);

      await request(app)
        .put(`${APP_ROUTES.POSTS}/${createdPost.id}`)
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
    });

    it('should return 204 status', async () => {
      const createdPost = await createPost(app);

      await request(app)
        .put(`${APP_ROUTES.POSTS}/${createdPost.id}`)
        .set('Authorization', authToken)
        .send({ ...mockUpdatedPost, blogId: createdPost.blogId })
        .expect(HTTP_STATUSES.NO_CONTENT);
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should return 401 status code', async () => {
      await request(app).delete(`${APP_ROUTES.POSTS}/1`).expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return 400 status code if send incorrect id', async () => {
      await request(app)
        .delete(`${APP_ROUTES.POSTS}/null`)
        .set('Authorization', authToken)
        .expect(HTTP_STATUSES.BAD_REQUEST);
    });

    it('should return 404 status code if post id not exist', async () => {
      const id = new ObjectId().toHexString();

      await request(app)
        .delete(`${APP_ROUTES.POSTS}/${id}`)
        .set('Authorization', authToken)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });

    it('should return 204 status', async () => {
      const createdPost = await createPost(app);

      await request(app)
        .delete(`${APP_ROUTES.POSTS}/${createdPost.id}`)
        .set('Authorization', authToken)
        .expect(HTTP_STATUSES.NO_CONTENT);

      await request(app)
        .get(`${APP_ROUTES.POSTS}/${createdPost.id}`)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });
  });
});
