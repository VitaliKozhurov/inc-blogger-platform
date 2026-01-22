import { APP_ROUTES, HTTP_STATUSES } from '../../../src/core/constants';
import { ERROR_FIELD_MESSAGES } from '../../../src/core/utils';
import { TestManager } from '../../utils/test-manager';
import { createUser } from '../../utils/users/create-user';
import { mockUser } from '../../utils/users/mock';

describe('Auth test', () => {
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

  describe('POST /auth/login', () => {
    it('should return a 204 status code with correct user login', async () => {
      const createdUser = await createUser(testManager);

      await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_LOGIN}`)
        .send({ loginOrEmail: createdUser.login, password: mockUser.password })
        .expect(HTTP_STATUSES.NO_CONTENT);
    });

    it('should return a 204 status code with correct user email', async () => {
      const createdUser = await createUser(testManager);

      await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_LOGIN}`)
        .send({ loginOrEmail: createdUser.email, password: mockUser.password })
        .expect(HTTP_STATUSES.NO_CONTENT);
    });

    it('should return 400 status code with validation errors', async () => {
      await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_LOGIN}`)
        .send({})
        .expect(HTTP_STATUSES.BAD_REQUEST)
        .expect({
          errorsMessages: [
            { field: 'loginOrEmail', message: ERROR_FIELD_MESSAGES.REQUIRED('loginOrEmail') },
            { field: 'password', message: ERROR_FIELD_MESSAGES.REQUIRED('password') },
          ],
        });
    });

    it('should return 401 status code if incorrect credentials', async () => {
      await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_LOGIN}`)
        .send({ loginOrEmail: 'incorrect', password: 'incorrect' })
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });
  });
});
