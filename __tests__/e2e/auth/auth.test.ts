import { ObjectId } from 'mongodb';

import { iocContainer } from '../../../src/composition-root';
import { JWTAdapter } from '../../../src/core/adapters';
import { APP_ROUTES } from '../../../src/core/constants';
import { HTTP_STATUSES } from '../../../src/core/types';
import { ERROR_FIELD_MESSAGES } from '../../../src/core/utils';
import { AuthTokenAdapter } from '../../../src/modules/auth/adapters/auth-token.adapter';
import { TestManager } from '../../utils/test-manager';
import { createUser } from '../../utils/users/create-user';
import { mockUser } from '../../utils/users/mock';

describe('Auth test', () => {
  const testManager = new TestManager();
  const jwtAdapter = iocContainer.get(JWTAdapter);
  const authTokenAdapter = iocContainer.get(AuthTokenAdapter);

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

      const { body } = await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_LOGIN}`)
        .send({ loginOrEmail: createdUser.login, password: mockUser.password })
        .expect(HTTP_STATUSES.OK);

      const token = jwtAdapter.decodeJWT(body.accessToken);

      expect(token?.userId).toBe(createdUser.id);
    });

    it('should return a 204 status code with correct user email', async () => {
      const createdUser = await createUser(testManager);

      const { body } = await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_LOGIN}`)
        .send({ loginOrEmail: createdUser.email, password: mockUser.password })
        .expect(HTTP_STATUSES.OK);

      const token = jwtAdapter.decodeJWT(body.accessToken);

      expect(token?.userId).toBe(createdUser.id);
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
      const createdUser = await createUser(testManager);

      await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_LOGIN}`)
        .send({ loginOrEmail: createdUser.login, password: 'incorrect' })
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return 429 status code if the number of attempts has reached the limit', async () => {
      for (let i = 0; i < 5; i++) {
        await testManager.context
          .request()
          .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_LOGIN}`)
          .send({ loginOrEmail: 'incorrect', password: 'incorrect' })
          .expect(HTTP_STATUSES.UNAUTHORIZED);
      }
      await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_LOGIN}`)
        .send({ loginOrEmail: 'incorrect', password: 'incorrect' })
        .expect(HTTP_STATUSES.MANY_REQUESTS);
    });
  });

  describe('POST /auth/register', () => {
    it('should return a 204 status code if send correct credentials', async () => {
      await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_REGISTRATION}`)
        .send(mockUser)
        .expect(HTTP_STATUSES.NO_CONTENT);
    });

    it('should return a 400 status code if send incorrect credentials', async () => {
      const res = await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_REGISTRATION}`)
        .send({ login: '', password: '', email: '' })
        .expect(HTTP_STATUSES.BAD_REQUEST);

      expect(res.body.errorsMessages.length).toBe(3);
    });

    it('should return a 400 status code if that user already exists', async () => {
      await createUser(testManager);

      await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_REGISTRATION}`)
        .send(mockUser)
        .expect(HTTP_STATUSES.BAD_REQUEST);
    });

    it('should return a 401 status code if user login with not confirmed account', async () => {
      await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_REGISTRATION}`)
        .send(mockUser)
        .expect(HTTP_STATUSES.NO_CONTENT);

      await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_LOGIN}`)
        .send({ loginOrEmail: mockUser.login, password: mockUser.password })
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });
  });

  describe('GET /auth/me', () => {
    it('should return a 200 status code with correct authorized user data', async () => {
      const createdUser = await createUser(testManager);

      const { body } = await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_LOGIN}`)
        .send({ loginOrEmail: createdUser.login, password: mockUser.password })
        .expect(HTTP_STATUSES.OK);

      await testManager.context
        .request()
        .get(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_ME}`)
        .set('Authorization', `Bearer ${body.accessToken}`)
        .expect(HTTP_STATUSES.OK)
        .expect({ email: createdUser.email, login: createdUser.login, userId: createdUser.id });
    });

    it('should return a 401 status code if send incorrect token', async () => {
      await testManager.context
        .request()
        .get(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_ME}`)
        .set('Authorization', `Bearer incorrect`)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });
  });

  describe('POST /auth/refresh-token', () => {
    it('should return a 401 status code if incorrect refreshToken', async () => {
      await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_REFRESH_TOKEN}`)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });

    it('should return a 401 status code if user not exist', async () => {
      const fakeId = new ObjectId().toString();
      const fakeDeviceId = '123';
      const refreshToken = authTokenAdapter.createRefreshToken({
        userId: fakeId,
        deviceId: fakeDeviceId,
      });

      await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_REFRESH_TOKEN}`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });
  });

  describe('POST /auth/logout', () => {
    it('should return a 204 status code', async () => {
      const createdUser = await createUser(testManager);

      const response = await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_LOGIN}`)
        .send({ loginOrEmail: createdUser.login, password: mockUser.password });

      const cookies = response.headers['set-cookie'];

      const refreshToken = cookies[0].split(';')[0].split('=')[1];

      await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_LOGOUT}`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(HTTP_STATUSES.NO_CONTENT);
    });
  });

  describe('POST /auth/password-recovery', () => {
    it('should return a 204 status code if send correct email', async () => {
      await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_PASSWORD_RECOVERY}`)
        .send(mockUser)
        .expect(HTTP_STATUSES.NO_CONTENT);
    });

    it('should return a 400 status code if send incorrect email', async () => {
      const res = await testManager.context
        .request()
        .post(`${APP_ROUTES.AUTH}${APP_ROUTES.AUTH_PASSWORD_RECOVERY}`)
        .send({ email: '' })
        .expect(HTTP_STATUSES.BAD_REQUEST);

      expect(res.body.errorsMessages.length).toBe(1);
    });
  });
});
