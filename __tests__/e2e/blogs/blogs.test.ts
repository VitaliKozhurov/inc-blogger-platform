import { Server } from 'http';

import express from 'express';
import request from 'supertest';

import { BlogInputType } from '../../../src/blogs/types/blog';
import { APP_ROUTES, HTTP_STATUSES } from '../../../src/core/constants';
import { ERROR_FIELD_MESSAGES } from '../../../src/core/utils';
import { initApp } from '../../../src/init-app';

const mockBlog: BlogInputType = {
  name: 'New blog',
  description: 'Blog description',
  websiteUrl: 'https://google.com',
};

const mockUpdatedBlog: BlogInputType = {
  name: 'Updated blog',
  description: 'Updated description',
  websiteUrl: 'https://updated-google.com',
};

describe('Blogs', () => {
  const app = express();
  let server: Server;

  const authToken = process.env.AUTH_TOKEN;

  beforeAll(async () => {
    server = await initApp(app);
  });

  beforeEach(async () => {
    await request(app).delete(`${APP_ROUTES.TESTING}${APP_ROUTES.CLEAR_DATA}`);
  });

  afterAll(() => {
    server.close();
  });

  const createBlog = async () => {
    const { body } = await request(app)
      .post(`${APP_ROUTES.BLOGS}`)
      .set('Authorization', authToken)
      .send(mockBlog);

    return body;
  };

  describe('GET /blogs', () => {
    it('should return 200 status and array of blogs', async () => {
      await request(app).get(`${APP_ROUTES.BLOGS}`).expect(HTTP_STATUSES.OK).expect([]);
    });
  });

  describe('POST /blogs', () => {
    it('should return 201 status and created blog', async () => {
      const { body: createdBlog } = await request(app)
        .post(`${APP_ROUTES.BLOGS}`)
        .set('Authorization', authToken)
        .send(mockBlog)
        .expect(HTTP_STATUSES.CREATED)
        .expect({ id: '1', ...mockBlog });

      await request(app).get(`${APP_ROUTES.BLOGS}`).expect(HTTP_STATUSES.OK).expect([createdBlog]);
      await request(app).get(`${APP_ROUTES.BLOGS}/1`).expect(HTTP_STATUSES.OK).expect(createdBlog);
    });

    it('should return 400 status with errors', async () => {
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

      await request(app).get(`${APP_ROUTES.BLOGS}`).expect(HTTP_STATUSES.OK).expect([]);
    });
  });

  describe('PUT /blogs:id', () => {
    it('should return 400 status send incorrect id', async () => {
      await request(app)
        .put(`${APP_ROUTES.BLOGS}/null`)
        .set('Authorization', authToken)
        .send(mockUpdatedBlog)
        .expect(HTTP_STATUSES.BAD_REQUEST);

      await request(app).get(`${APP_ROUTES.BLOGS}`).expect(HTTP_STATUSES.OK).expect([]);
    });

    it('should return 404 status if blog not found', async () => {
      await request(app)
        .put(`${APP_ROUTES.BLOGS}/100`)
        .set('Authorization', authToken)
        .send(mockUpdatedBlog)
        .expect(HTTP_STATUSES.NOT_FOUND);

      await request(app).get(`${APP_ROUTES.BLOGS}`).expect(HTTP_STATUSES.OK).expect([]);
    });

    it('should return 400 status if send incorrect data', async () => {
      const createdBlog = await createBlog();

      await request(app)
        .put(`${APP_ROUTES.BLOGS}/1`)
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

      await request(app).get(`${APP_ROUTES.BLOGS}`).expect(HTTP_STATUSES.OK).expect([createdBlog]);
    });

    it('should return 204 status', async () => {
      const createdBlog = await createBlog();

      await request(app)
        .put(`${APP_ROUTES.BLOGS}/1`)
        .set('Authorization', authToken)
        .send(mockUpdatedBlog)
        .expect(HTTP_STATUSES.NO_CONTENT);

      const updatedBlog = { ...createdBlog, ...mockUpdatedBlog };

      await request(app).get(`${APP_ROUTES.BLOGS}`).expect(HTTP_STATUSES.OK).expect([updatedBlog]);
    });
  });

  describe('DELETE /blogs/:id', () => {
    it('should return 400 status if send incorrect id', async () => {
      const createdBlog = await createBlog();

      await request(app)
        .delete(`${APP_ROUTES.BLOGS}/null`)
        .set('Authorization', authToken)
        .expect(HTTP_STATUSES.BAD_REQUEST);

      await request(app).get(`${APP_ROUTES.BLOGS}`).expect(HTTP_STATUSES.OK).expect([createdBlog]);
    });

    it('should return 404 status if blog id not exist', async () => {
      await request(app)
        .delete('/blogs/100')
        .set('Authorization', authToken)
        .expect(HTTP_STATUSES.NOT_FOUND);

      await request(app).get(`${APP_ROUTES.BLOGS}`).expect(HTTP_STATUSES.OK).expect([]);
    });

    it('should return 204 status', async () => {
      const createdBlog = await createBlog();

      await request(app).get(`${APP_ROUTES.BLOGS}`).expect(HTTP_STATUSES.OK).expect([createdBlog]);

      await request(app)
        .delete('/blogs/1')
        .set('Authorization', authToken)
        .expect(HTTP_STATUSES.NO_CONTENT);

      await request(app).get(`${APP_ROUTES.BLOGS}`).expect(HTTP_STATUSES.OK).expect([]);
    });
  });
});
