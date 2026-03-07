import { add } from 'date-fns';
import { ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Mongoose } from 'mongoose';

import { iocContainer } from '../../../src/composition-root';
import { runDB, stopDb } from '../../../src/config/mongo.db';
import { SETTINGS } from '../../../src/config/settings';
import { HTTP_STATUSES } from '../../../src/core/types';
import { RESULT_STATUSES } from '../../../src/core/utils';
import { AuthTokenAdapter } from '../../../src/modules/auth/adapters/auth-token.adapter';
import { EmailRegistrationAdapter } from '../../../src/modules/auth/adapters/email-registration.adapter';
import { AuthService } from '../../../src/modules/auth/auth.service';
import { UserDeviceSessionDocument } from '../../../src/modules/user-device-session/types/user-device-session.types';
import { UserDeviceSessionsRepository } from '../../../src/modules/user-device-session/user-device-sessions.repository';
import { UserType } from '../../../src/modules/users/types/user.types';
import { UserModel } from '../../../src/modules/users/user.model';

describe('Auth test', () => {
  const authService = iocContainer.get(AuthService);
  const authTokenAdapter = iocContainer.get(AuthTokenAdapter);
  const userDeviceSessionsRepository = iocContainer.get(UserDeviceSessionsRepository);
  const emailRegistrationAdapter = iocContainer.get(EmailRegistrationAdapter);

  const confirmationCode = '123';
  let DB: Mongoose;

  const createUser = async (emailConfirmation: Partial<UserType['emailConfirmation']> = {}) => {
    const user = {
      _id: new ObjectId(),
      createdAt: new Date().toISOString(),
      email: SETTINGS.APP_EMAIL_ADDRESS ?? '',
      login: 'super_user',
      passwordHash: 'hash#for#password',
      emailConfirmation: {
        confirmationCode,
        expirationDate: add(new Date(), { hours: 1 }).toISOString(),
        isConfirmed: true,
        ...emailConfirmation,
      },
    };

    await UserModel.create(user);

    return user;
  };

  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    DB = await runDB(mongoServer.getUri());
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await DB.connection.dropDatabase();
  });

  afterAll(async () => {
    await stopDb();
  });

  describe('POST /auth/registration', () => {
    jest.spyOn(emailRegistrationAdapter, 'sendConfirmationCode').mockResolvedValue(true);

    it('should return a 204 status code if send correct code', async () => {
      const result = await authService.registration({
        login: 'Login',
        email: SETTINGS.APP_EMAIL_ADDRESS,
        password: 'secret_password',
      });

      expect(result.status).toBe(RESULT_STATUSES.OK);
      expect(emailRegistrationAdapter.sendConfirmationCode).toHaveBeenCalled();
    });

    it('should return a 400 status code if send credentials with the same user in system', async () => {
      const createdUser = await createUser();

      const result = await authService.registration({
        login: 'super_user',
        email: createdUser.email,
        password: 'secret_password',
      });

      expect(result.status).toBe(HTTP_STATUSES.BAD_REQUEST);
      expect(emailRegistrationAdapter.sendConfirmationCode).not.toHaveBeenCalled();
    });
  });

  describe('POST /auth/registration-confirmation', () => {
    it('should return a success status code if email success verified', async () => {
      const createdUser = await createUser({ isConfirmed: false });

      const result = await authService.registrationConfirmation(
        createdUser.emailConfirmation.confirmationCode
      );

      expect(result.status).toBe(RESULT_STATUSES.OK);
      const user = await UserModel.findOne({ _id: createdUser._id });

      expect(user?.emailConfirmation.isConfirmed).toBe(true);
    });

    it('should return status 400 if user has confirm status', async () => {
      const createdUser = await createUser();

      const result = await authService.registrationConfirmation(
        createdUser.emailConfirmation.confirmationCode
      );

      expect(result.status).toBe(RESULT_STATUSES.BAD_REQUEST);
    });

    it('should return status 400 if send incorrect confirmation code', async () => {
      const result = await authService.registrationConfirmation('invalid_code');

      expect(result.status).toBe(RESULT_STATUSES.BAD_REQUEST);
    });
  });

  describe('POST /auth/registration-email-confirmation', () => {
    jest.spyOn(emailRegistrationAdapter, 'resendConfirmationCode').mockResolvedValue(true);

    it('should return a 204 status code if send correct email for resending confirmation code', async () => {
      const createdUser = await createUser({ isConfirmed: false });

      const result = await authService.registrationEmailResending({ email: createdUser.email });

      expect(result.status).toBe(HTTP_STATUSES.OK);
      expect(emailRegistrationAdapter.resendConfirmationCode).toHaveBeenCalled();
    });

    it('should return a 400 status code if send not correct email', async () => {
      const result = await authService.registrationEmailResending({ email: 'fake@email.com' });

      expect(result.status).toBe(HTTP_STATUSES.BAD_REQUEST);
      expect(emailRegistrationAdapter.resendConfirmationCode).not.toHaveBeenCalled();
    });

    it('should return a 400 status code if account is confirmed', async () => {
      const createdUser = await createUser();
      const result = await authService.registrationEmailResending({ email: createdUser.email });

      expect(result.status).toBe(HTTP_STATUSES.BAD_REQUEST);
      expect(emailRegistrationAdapter.resendConfirmationCode).not.toHaveBeenCalled();
    });
  });

  describe('POST /auth/refresh', () => {
    jest.spyOn(userDeviceSessionsRepository, 'saveSession').mockResolvedValue(undefined);
    jest
      .spyOn(userDeviceSessionsRepository, 'getSessionByFilter')
      .mockResolvedValue({} as UserDeviceSessionDocument);

    it('should return a 200 status code if send correct refreshToken', async () => {
      const mockIp = '0.0.0.0';
      const createdUser = await createUser();

      const refreshToken = authTokenAdapter.createRefreshToken({
        userId: createdUser._id.toString(),
        deviceId: '123',
      });

      const result = await authService.refreshToken({ ip: mockIp, refreshToken });

      expect(result.data?.accessToken).toBeDefined();
      expect(result.data?.refreshToken).toBeDefined();
    });
  });

  describe('POST /password-recovery', () => {
    jest.spyOn(emailRegistrationAdapter, 'sendPasswordRecoveryCode').mockResolvedValue(true);

    it('should return a 200 status code', async () => {
      const createdUser = await createUser();
      const result = await authService.passwordRecovery({ email: createdUser.email });

      expect(result.status).toBe(RESULT_STATUSES.OK);
      expect(emailRegistrationAdapter.sendPasswordRecoveryCode).toHaveBeenCalled();
    });
  });

  describe('POST /new-password', () => {
    it('should return a 200 status code', async () => {
      const createdUser = await createUser();

      await authService.passwordRecovery({ email: createdUser.email });

      const user = await UserModel.findOne({ _id: createdUser._id });

      expect(user?.passwordRecovery?.recoveryCode).toBeDefined();
    });
  });
});
