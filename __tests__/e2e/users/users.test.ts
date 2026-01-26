import { ObjectId } from 'mongodb';

import { APP_ROUTES } from '../../../src/core/constants';
import { HTTP_STATUSES, ResponseWithPaginationType } from '../../../src/core/types';
import { ERROR_FIELD_MESSAGES } from '../../../src/core/utils';
import { UserViewModelType } from '../../../src/users/types';
import { TestManager } from '../../utils/test-manager';
import { createUser } from '../../utils/users/create-user';
import { mockUser } from '../../utils/users/mock';

type UsersResponseType = ResponseWithPaginationType<UserViewModelType>;

describe('Users test', () => {
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

  describe('GET /users', () => {
    it('should return 401 status code if token invalid', async () => {
      await testManager.context
        .request()
        .get(`${APP_ROUTES.USERS}`)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return a 200 status code with an empty array when no users are available', async () => {
      const { body }: { body: UsersResponseType } = await testManager.context
        .request()
        .get(`${APP_ROUTES.USERS}`)
        .set('Authorization', testManager.authToken)
        .expect(HTTP_STATUSES.OK);

      expect(body.items).toHaveLength(0);
      expect(body.totalCount).toBe(0);
    });

    it('should return a 200 status code with the created user after a successful creation', async () => {
      await createUser(testManager);

      const { body }: { body: UsersResponseType } = await testManager.context
        .request()
        .get(`${APP_ROUTES.USERS}`)
        .set('Authorization', testManager.authToken)
        .expect(HTTP_STATUSES.OK);

      expect(body.items).toHaveLength(1);
      expect(body.pagesCount).toBe(1);
      expect(body.totalCount).toBe(1);
    });

    it('should return a 400 status code with errors if query params is incorrect', async () => {
      const { body } = await testManager.context
        .request()
        .get(`${APP_ROUTES.USERS}?sortBy=price&sortDirection=ASC&pageNumber=o&pageSize=o`)
        .set('Authorization', testManager.authToken)
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

  describe('POST /users', () => {
    it('should return 401 status code if token invalid', async () => {
      await testManager.context
        .request()
        .post(`${APP_ROUTES.USERS}`)
        .send(mockUser)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return 400 status code if create user with same login', async () => {
      await createUser(testManager);

      await testManager.context
        .request()
        .post(`${APP_ROUTES.USERS}`)
        .set('Authorization', testManager.authToken)
        .send(mockUser)
        .expect(HTTP_STATUSES.BAD_REQUEST)
        .expect({
          errorMessages: [{ field: 'login', message: 'User with the same login already exists' }],
        });
    });

    it('should return 400 status code if create user with same email', async () => {
      await createUser(testManager);

      const response = await testManager.context
        .request()
        .post(`${APP_ROUTES.USERS}`)
        .set('Authorization', testManager.authToken)
        .send({ ...mockUser, login: 'login2' })
        .expect(HTTP_STATUSES.BAD_REQUEST);

      expect(response.body.errorMessages[0].field).toBe('email');
    });

    it('should return 400 status code with validation errors', async () => {
      await testManager.context
        .request()
        .post(`${APP_ROUTES.USERS}`)
        .set('Authorization', testManager.authToken)
        .send({})
        .expect(HTTP_STATUSES.BAD_REQUEST)
        .expect({
          errorsMessages: [
            { field: 'login', message: ERROR_FIELD_MESSAGES.REQUIRED('login') },
            { field: 'email', message: ERROR_FIELD_MESSAGES.REQUIRED('email') },
            { field: 'password', message: ERROR_FIELD_MESSAGES.REQUIRED('password') },
          ],
        });
    });

    it('should return 201 status code and created user', async () => {
      const createdUser = await createUser(testManager);

      expect(createdUser).toHaveProperty('id');

      const { body }: { body: ResponseWithPaginationType<UserViewModelType> } =
        await testManager.context
          .request()
          .get(`${APP_ROUTES.USERS}`)
          .set('Authorization', testManager.authToken)
          .expect(HTTP_STATUSES.OK);

      expect(body.items).toEqual([createdUser]);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should return 401 status code if token invalid', async () => {
      await testManager.context
        .request()
        .delete(`${APP_ROUTES.USERS}/1`)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return 400 status code if incorrect user id', async () => {
      await testManager.context
        .request()
        .delete(`${APP_ROUTES.USERS}/null`)
        .set('Authorization', testManager.authToken)
        .expect(HTTP_STATUSES.BAD_REQUEST);
    });

    it('should return 404 status code if blog not exist', async () => {
      const id = new ObjectId().toHexString();

      await testManager.context
        .request()
        .delete(`${APP_ROUTES.USERS}/${id}`)
        .set('Authorization', testManager.authToken)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });

    it('should return 204 status code if request with correct blog id', async () => {
      const createdUser = await createUser(testManager);

      await testManager.context
        .request()
        .delete(`${APP_ROUTES.USERS}/${createdUser.id}`)
        .set('Authorization', testManager.authToken)
        .expect(HTTP_STATUSES.NO_CONTENT);

      await testManager.context
        .request()
        .get(`${APP_ROUTES.USERS}/${createdUser.id}`)
        .expect(HTTP_STATUSES.NOT_FOUND);
    });
  });
});
