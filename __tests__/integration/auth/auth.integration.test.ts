import { Db, ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { emailRegistrationAdapter } from '../../../src/auth/adapters';
import { authService } from '../../../src/auth/application';
import { HTTP_STATUSES } from '../../../src/core/types';
import { RESULT_STATUSES } from '../../../src/core/utils';
import { runDB, stopDb } from '../../../src/db/mongo.db';

import { SETTINGS } from './../../../src/core/settings/settings';

describe('Auth test', () => {
  // const testManager = new TestManager();
  // const confirmationCode = '123';
  let DB: Db;

  // const createUser = (emailConfirmation: Partial<UserDBType['emailConfirmation']> = {}) => {
  //   return {
  //     _id: new ObjectId(),
  //     createdAt: '',
  //     email: SETTINGS.APP_EMAIL_ADDRESS ?? '',
  //     login: '',
  //     passwordHash: '',
  //     emailConfirmation: {
  //       confirmationCode,
  //       expirationDate: add(new Date(), { hours: 1 }).toISOString(),
  //       isConfirmed: false,
  //       ...emailConfirmation,
  //     },
  //   };
  // };

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

    it('should return a 400 status code if send incorrect data', async () => {
      await DB.collection('users').insertOne({
        _id: new ObjectId(),
        createdAt: new Date().toISOString(),
        email: SETTINGS.APP_EMAIL_ADDRESS ?? '',
        login: 'super_user',
        passwordHash: '',
        emailConfirmation: {
          confirmationCode: '',
          expirationDate: '',
          isConfirmed: true,
        },
      });

      const result = await authService.registration({
        login: 'super_user',
        email: SETTINGS.APP_EMAIL_ADDRESS ?? '',
        password: 'secret_password',
      });

      console.log(result);

      expect(result.status).toBe(HTTP_STATUSES.BAD_REQUEST);
      expect(emailRegistrationAdapter.sendConfirmationCode).not.toHaveBeenCalled();
    });
  });

  // describe.skip('POST /auth/registration-confirmation', () => {
  //   it('should return a 204 status code if send correct code', async () => {
  //     await usersCollection.insertOne(createUser());

  //     const result = await authService.registrationConfirmation(confirmationCode);

  //     expect(result.status).toBe(HTTP_STATUSES.OK);
  //   });

  //   it('should return a 400 status code if send incorrect code', async () => {
  //     await usersCollection.insertOne(createUser({ confirmationCode: '456' }));

  //     const result = await authService.registrationConfirmation(confirmationCode);

  //     expect(result.status).toBe(HTTP_STATUSES.BAD_REQUEST);
  //   });

  //   it('should return a 400 status code if send expired code', async () => {
  //     await usersCollection.insertOne(createUser({ expirationDate: new Date().toISOString() }));

  //     const result = await authService.registrationConfirmation(confirmationCode);

  //     expect(result.status).toBe(HTTP_STATUSES.BAD_REQUEST);
  //   });
  // });

  // describe.skip('POST /auth/registration-email-resending', () => {
  //   it('should return a 204 status code if send correct code', async () => {
  //     await usersCollection.insertOne(createUser());

  //     const result = await authService.registrationEmailResending({
  //       email: SETTINGS.APP_EMAIL_ADDRESS ?? '',
  //     });

  //     expect(result.status).toBe(HTTP_STATUSES.OK);
  //   });

  //   it('should return a 400 status code if user email status is confirmed', async () => {
  //     await usersCollection.insertOne(createUser({ isConfirmed: true }));

  //     const result = await authService.registrationEmailResending({
  //       email: SETTINGS.APP_EMAIL_ADDRESS ?? '',
  //     });

  //     expect(result.status).toBe(HTTP_STATUSES.BAD_REQUEST);
  //   });
  // });
});
