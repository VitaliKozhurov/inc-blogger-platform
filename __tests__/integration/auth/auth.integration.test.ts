import { add } from 'date-fns';
import { Db, ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { emailRegistrationAdapter } from '../../../src/auth/adapters';
import { authService } from '../../../src/auth/application';
import { HTTP_STATUSES } from '../../../src/core/types';
import { RESULT_STATUSES } from '../../../src/core/utils';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { UserDBType } from '../../../src/users/types';

import { SETTINGS } from './../../../src/core/settings/settings';

describe('Auth test', () => {
  // const testManager = new TestManager();
  const confirmationCode = '123';
  let DB: Db;

  const createUser = async (emailConfirmation: Partial<UserDBType['emailConfirmation']> = {}) => {
    const user = {
      _id: new ObjectId(),
      createdAt: new Date().toISOString(),
      email: SETTINGS.APP_EMAIL_ADDRESS ?? '',
      login: 'super_user',
      passwordHash: '',
      emailConfirmation: {
        confirmationCode,
        expirationDate: add(new Date(), { hours: 1 }).toISOString(),
        isConfirmed: true,
        ...emailConfirmation,
      },
    };

    await DB.collection('users').insertOne(user);

    return user;
  };

  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    DB = await runDB(mongoServer.getUri());
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await DB.dropDatabase();
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
      await createUser();

      const result = await authService.registration({
        login: 'super_user',
        email: SETTINGS.APP_EMAIL_ADDRESS ?? '',
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
      const user = await DB.collection('users').findOne({ _id: createdUser._id });

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

    // it('should return a 400 status code if send credentials with the same user in system', async () => {
    //   await createUser();

    //   const result = await authService.registration({
    //     login: 'super_user',
    //     email: SETTINGS.APP_EMAIL_ADDRESS ?? '',
    //     password: 'secret_password',
    //   });

    //   expect(result.status).toBe(HTTP_STATUSES.BAD_REQUEST);
    //   expect(emailRegistrationAdapter.sendConfirmationCode).not.toHaveBeenCalled();
    // });
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
});
