import { randomUUID } from 'crypto';

import { ObjectId } from 'mongodb';

import { iocContainer } from '../../../src/composition-root';
import { APP_ROUTES } from '../../../src/core/constants';
import { HTTP_STATUSES } from '../../../src/core/types';
import { AuthTokenAdapter } from '../../../src/modules/auth/adapters/auth-token.adapter';
import { UserDeviceSessionModel } from '../../../src/modules/user-device-session/user-device-session.model';
import { TestManagerMockDB } from '../../utils/test-manager-mock-db';

describe('User sessions test', () => {
  const testManager = new TestManagerMockDB();
  const authTokenAdapter = iocContainer.get(AuthTokenAdapter);

  const createSession = async (refreshToken: string) => {
    const { deviceId, userId, iat, exp } = authTokenAdapter.decodeRefreshToken(refreshToken)!;

    const session = {
      deviceId,
      deviceName: 'Test device',
      ip: '0.0.0.0',
      userId,
      iat: new Date(iat * 1000),
      expirationAt: new Date(exp * 1000),
    };

    await UserDeviceSessionModel.create(session);

    return session;
  };

  beforeAll(async () => {
    await testManager.init();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await testManager.clearDB();
  });

  afterAll(async () => {
    await testManager.closeSession();
  });

  describe('GET /security/devices', () => {
    it('should return a 200 status code with sessions', async () => {
      const deviceId = randomUUID();
      const userId = new ObjectId().toString();
      const refreshToken = authTokenAdapter.createRefreshToken({ userId, deviceId });

      await createSession(refreshToken);

      const result = await testManager
        .request()
        .get(`${APP_ROUTES.SECURITY}${APP_ROUTES.SECURITY_DEVICES}`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(HTTP_STATUSES.OK);

      expect(result.body).toHaveLength(1);
      expect(result.body[0].deviceId).toBe(deviceId);
    });

    it('should return a 401 status code if send incorrect refresh token', async () => {
      const refreshToken = 'fake token';

      await testManager
        .request()
        .get(`${APP_ROUTES.SECURITY}${APP_ROUTES.SECURITY_DEVICES}`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });
  });

  describe('DELETE /security/devices', () => {
    it('should return a 204 status code with sessions', async () => {
      const userId = randomUUID();

      const primaryRefreshToken = authTokenAdapter.createRefreshToken({
        userId,
        deviceId: new ObjectId().toString(),
      });

      const secondaryRefreshToken = authTokenAdapter.createRefreshToken({
        userId,
        deviceId: new ObjectId().toString(),
      });

      const primarySession = await createSession(primaryRefreshToken);
      const secondarySession = await createSession(secondaryRefreshToken);

      const sessions = await testManager
        .request()
        .get(`${APP_ROUTES.SECURITY}${APP_ROUTES.SECURITY_DEVICES}`)
        .set('Cookie', `refreshToken=${primaryRefreshToken}`)
        .expect(HTTP_STATUSES.OK);

      expect(sessions.body).toHaveLength(2);
      expect(sessions.body[0].deviceId).toBe(primarySession.deviceId);
      expect(sessions.body[1].deviceId).toBe(secondarySession.deviceId);

      await testManager
        .request()
        .delete(`${APP_ROUTES.SECURITY}${APP_ROUTES.SECURITY_DEVICES}`)
        .set('Cookie', `refreshToken=${primaryRefreshToken}`)
        .expect(HTTP_STATUSES.NO_CONTENT);

      const sessionsAfterDeleting = await testManager
        .request()
        .get(`${APP_ROUTES.SECURITY}${APP_ROUTES.SECURITY_DEVICES}`)
        .set('Cookie', `refreshToken=${primaryRefreshToken}`)
        .expect(HTTP_STATUSES.OK);

      expect(sessionsAfterDeleting.body).toHaveLength(1);
      expect(sessionsAfterDeleting.body[0].deviceId).toBe(primarySession.deviceId);
    });

    it('should return a 401 status code if send incorrect refresh token', async () => {
      const refreshToken = 'fake token';

      await testManager
        .request()
        .delete(`${APP_ROUTES.SECURITY}${APP_ROUTES.SECURITY_DEVICES}`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });
  });

  describe('DELETE /security/devices/:deviceId', () => {
    it('should return a 204 status code with sessions', async () => {
      const userId = randomUUID();

      const primaryRefreshToken = authTokenAdapter.createRefreshToken({
        userId,
        deviceId: new ObjectId().toString(),
      });

      const secondaryRefreshToken = authTokenAdapter.createRefreshToken({
        userId,
        deviceId: new ObjectId().toString(),
      });

      const firstSession = await createSession(primaryRefreshToken);
      const secondSession = await createSession(secondaryRefreshToken);

      const sessions = await testManager
        .request()
        .get(`${APP_ROUTES.SECURITY}${APP_ROUTES.SECURITY_DEVICES}`)
        .set('Cookie', `refreshToken=${primaryRefreshToken}`)
        .expect(HTTP_STATUSES.OK);

      expect(sessions.body).toHaveLength(2);
      expect(sessions.body[0].deviceId).toBe(firstSession.deviceId);
      expect(sessions.body[1].deviceId).toBe(secondSession.deviceId);

      await testManager
        .request()
        .delete(`${APP_ROUTES.SECURITY}${APP_ROUTES.SECURITY_DEVICES}/${firstSession.deviceId}`)
        .set('Cookie', `refreshToken=${secondaryRefreshToken}`)
        .expect(HTTP_STATUSES.NO_CONTENT);

      const sessionsAfterDeleting = await testManager
        .request()
        .get(`${APP_ROUTES.SECURITY}${APP_ROUTES.SECURITY_DEVICES}`)
        .set('Cookie', `refreshToken=${secondaryRefreshToken}`)
        .expect(HTTP_STATUSES.OK);

      expect(sessionsAfterDeleting.body).toHaveLength(1);
      expect(sessionsAfterDeleting.body[0].deviceId).toBe(secondSession.deviceId);
    });

    it('should return a 403 status code if other user device id', async () => {
      const userId1 = randomUUID();
      const userId2 = randomUUID();

      const firstUserRefreshToken = authTokenAdapter.createRefreshToken({
        userId: userId1,
        deviceId: new ObjectId().toString(),
      });

      const secondUserRefreshToken = authTokenAdapter.createRefreshToken({
        userId: userId2,
        deviceId: new ObjectId().toString(),
      });

      const firstSession = await createSession(firstUserRefreshToken);

      await createSession(secondUserRefreshToken);

      await testManager
        .request()
        .delete(`${APP_ROUTES.SECURITY}${APP_ROUTES.SECURITY_DEVICES}/${firstSession.deviceId}`)
        .set('Cookie', `refreshToken=${secondUserRefreshToken}`)
        .expect(HTTP_STATUSES.FORBIDDEN);
    });

    it('should return a 401 status code if send incorrect refresh token', async () => {
      const refreshToken = 'fake token';
      const fakeDeviceId = randomUUID();

      await testManager
        .request()
        .delete(`${APP_ROUTES.SECURITY}${APP_ROUTES.SECURITY_DEVICES}/${fakeDeviceId}`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(HTTP_STATUSES.UNAUTHORIZED);
    });
  });
});
