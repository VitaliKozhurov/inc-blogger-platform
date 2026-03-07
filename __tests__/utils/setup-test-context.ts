import express from 'express';
import superTestRequest from 'supertest';

import { runDB, stopDb } from '../../src/config/mongo.db';
import { SETTINGS } from '../../src/config/settings';
import { APP_ROUTES } from '../../src/core/constants';
import { initApp } from '../../src/init-app';

export const setupTestContext = async () => {
  const app = express();
  const request = () => superTestRequest(app);

  await runDB(SETTINGS.MONGO_URL);

  const server = await initApp(app);

  const clearDb = async () =>
    await request().delete(`${APP_ROUTES.TESTING}${APP_ROUTES.CLEAR_DATA}`);

  const closeSession = async () => {
    await clearDb();
    await stopDb();
    server.close();
  };

  return {
    request,
    closeSession,
    clearDb,
    server,
  };
};

export type TestContextType = Awaited<ReturnType<typeof setupTestContext>>;
