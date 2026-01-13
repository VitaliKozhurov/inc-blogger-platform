import { Server } from 'http';

import express from 'express';
import { ObjectId } from 'mongodb';
import request from 'supertest';

import { APP_ROUTES, HTTP_STATUSES } from '../../../src/core/constants';
import { ERROR_FIELD_MESSAGES } from '../../../src/core/utils';
import { stopDb } from '../../../src/db/mongo.db';
import { createBlog } from '../../utils/blogs/createBlog';
import { clearDb } from '../../utils/clear-db';
import { getAuthToken } from '../../utils/get-auth-token';
import { setupTestEnvironments } from '../../utils/setup-test-environment';

import { mockBlog, mockUpdatedBlog } from './mock';

describe('Blogs', () => {
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

  describe('GET /blogs', () => {
    it('should return 200 status and array of blogs', async () => {
      await request(app).get(`${APP_ROUTES.BLOGS}`).expect(HTTP_STATUSES.OK);
    });
  });

  describe('GET /blogs/:id', () => {
    it('should return 200 status and blog', async () => {
      const createdBlog = await createBlog(app);

      await request(app)
        .get(`${APP_ROUTES.BLOGS}/${createdBlog.id}`)
        .expect(HTTP_STATUSES.OK)
        .expect(createdBlog);
    });
  });

  describe('POST /blogs', () => {
    it('should return 401 status code if token invalid', async () => {
      await request(app)
        .post(`${APP_ROUTES.BLOGS}`)
        .send(mockBlog)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return 400 status with validation errors', async () => {
      await request(app)
        .post(`${APP_ROUTES.BLOGS}`)
        .set('Authorization', authToken)
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

    it('should return 201 status and created blog', async () => {
      const createdBlog = await createBlog(app);

      expect(createdBlog).toHaveProperty('id');

      const response = await request(app).get(`${APP_ROUTES.BLOGS}`).expect(HTTP_STATUSES.OK);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('PUT /blogs:id', () => {
    it('should return 401 status code if token invalid', async () => {
      await request(app)
        .put(`${APP_ROUTES.BLOGS}/1`)
        .send(mockUpdatedBlog)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return 400 status code if uri :id incorrect ', async () => {
      await request(app)
        .put(`${APP_ROUTES.BLOGS}/null`)
        .set('Authorization', authToken)
        .send(mockUpdatedBlog)
        .expect(HTTP_STATUSES.BAD_REQUEST);
    });

    it('should return 404 status code if blog not found', async () => {
      const id = new ObjectId().toHexString();

      await request(app)
        .put(`${APP_ROUTES.BLOGS}/${id}`)
        .set('Authorization', authToken)
        .send(mockUpdatedBlog)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });

    it('should return 400 status code if request data incorrect', async () => {
      const createdBlog = await createBlog(app);

      await request(app)
        .put(`${APP_ROUTES.BLOGS}/${createdBlog.id}`)
        .set('Authorization', authToken)
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

    it('should return 204 status code after correct updating', async () => {
      const createdBlog = await createBlog(app);

      await request(app)
        .put(`${APP_ROUTES.BLOGS}/${createdBlog.id}`)
        .set('Authorization', authToken)
        .send(mockUpdatedBlog)
        .expect(HTTP_STATUSES.NO_CONTENT);
    });
  });

  describe('DELETE /blogs/:id', () => {
    it('should return 401 status code if token invalid', async () => {
      await request(app).delete(`${APP_ROUTES.BLOGS}/1`).expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return 400 status code if send incorrect id', async () => {
      await request(app)
        .delete(`${APP_ROUTES.BLOGS}/null`)
        .set('Authorization', authToken)
        .expect(HTTP_STATUSES.BAD_REQUEST);
    });

    it('should return 404 status code if blog id not exist', async () => {
      const id = new ObjectId().toHexString();

      await request(app)
        .delete(`${APP_ROUTES.BLOGS}/${id}`)
        .set('Authorization', authToken)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });

    it('should return 204 status code if :id correct', async () => {
      const createdBlog = await createBlog(app);

      await request(app)
        .delete(`${APP_ROUTES.BLOGS}/${createdBlog.id}`)
        .set('Authorization', authToken)
        .expect(HTTP_STATUSES.NO_CONTENT);

      await request(app)
        .get(`${APP_ROUTES.BLOGS}/${createdBlog.id}`)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });
  });
});
