import { add } from 'date-fns/add';
import { ObjectId } from 'mongodb';

import { authService } from '../../../src/auth/application';
import { HTTP_STATUSES } from '../../../src/core/types';
import { usersCollection } from '../../../src/db/mongo.db';
import { UserDBType } from '../../../src/users/types';
import { TestManager } from '../../utils/test-manager';

import { SETTINGS } from './../../../src/core/settings/settings';

describe('Auth test', () => {
  const testManager = new TestManager();
  const confirmationCode = '123';

  const createUser = (emailConfirmation: Partial<UserDBType['emailConfirmation']> = {}) => {
    return {
      _id: new ObjectId(),
      createdAt: '',
      email: SETTINGS.EMAIL_ADDRESS ?? '',
      login: '',
      passwordHash: '',
      emailConfirmation: {
        confirmationCode,
        expirationDate: add(new Date(), { hours: 1 }).toISOString(),
        isConfirmed: false,
        ...emailConfirmation,
      },
    };
  };

  beforeAll(async () => {
    await testManager.init();
  });

  beforeEach(async () => {
    await testManager.clearDb();
  });

  afterAll(async () => {
    await testManager.close();
  });

  describe('POST /auth/registration-confirmation', () => {
    it('should return a 204 status code if send correct code', async () => {
      await usersCollection.insertOne(createUser());

      const result = await authService.registrationConfirmation(confirmationCode);

      expect(result.status).toBe(HTTP_STATUSES.OK);
    });

    it('should return a 400 status code if send incorrect code', async () => {
      await usersCollection.insertOne(createUser({ confirmationCode: '456' }));

      const result = await authService.registrationConfirmation(confirmationCode);

      expect(result.status).toBe(HTTP_STATUSES.BAD_REQUEST);
    });

    it('should return a 400 status code if send expired code', async () => {
      await usersCollection.insertOne(createUser({ expirationDate: new Date().toISOString() }));

      const result = await authService.registrationConfirmation(confirmationCode);

      expect(result.status).toBe(HTTP_STATUSES.BAD_REQUEST);
    });
  });

  describe('POST /auth/registration-email-resending', () => {
    it('should return a 204 status code if send correct code', async () => {
      await usersCollection.insertOne(createUser());

      const result = await authService.registrationEmailResending({
        email: SETTINGS.EMAIL_ADDRESS ?? '',
      });

      expect(result.status).toBe(HTTP_STATUSES.OK);
    });

    it('should return a 400 status code if user email status is confirmed', async () => {
      await usersCollection.insertOne(createUser({ isConfirmed: true }));

      const result = await authService.registrationEmailResending({
        email: SETTINGS.EMAIL_ADDRESS ?? '',
      });

      expect(result.status).toBe(HTTP_STATUSES.BAD_REQUEST);
    });
  });
});
