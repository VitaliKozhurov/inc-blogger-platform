import { randomUUID } from 'crypto';

import express, { Express } from 'express';
import { Db, ObjectId, WithId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';

import { authTokenAdapter } from '../../../src/auth/adapters';
import { APP_ROUTES } from '../../../src/core/constants';
import { runDB, stopDb } from '../../../src/db';
import { UserSessionDBType } from '../../../src/sessions/types';

describe('User sessions test', () => {
  let DB: Db;
  let app: Express;

  const createSession = async () => {
    const deviceId = randomUUID();
    const userId = new ObjectId().toString();
    const expirationDate = new Date(new Date().getTime() + 60 * 60 * 1000);
    const iat = new Date().getTime();
    const expirationAt = expirationDate.getTime() / 1000;

    const session: WithId<UserSessionDBType> = {
      _id: new ObjectId(),
      deviceId,
      deviceName: 'Test device',
      ip: '0.0.0.0',
      userId,
      expirationDate,
      iat,
      expirationAt,
    };

    await DB.collection('sessions').insertOne(session);

    return session;
  };

  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    DB = await runDB(mongoServer.getUri());
  });

  beforeEach(async () => {
    app = express();
    jest.clearAllMocks();
    await DB.dropDatabase();
  });

  afterAll(async () => {
    await stopDb();
  });

  describe('POST /security/devices', () => {
    it('should return a 204 status code if send correct code', async () => {
      const createdSession = createSession();
      const refreshToken = authTokenAdapter.createRefreshToken({
        userId: (await createdSession).userId,
        deviceId: (await createdSession).deviceId,
      });

      await request(app).get(`${APP_ROUTES.SECURITY}${APP_ROUTES.SECURITY_DEVICES}`);

      console.log(refreshToken);

      // const result = await getDevicesSessionsHandler(req, res);

      // console.log('result: ', result);
    });
  });
});
