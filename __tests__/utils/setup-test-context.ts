import express from 'express';
import superTestRequest from 'supertest';

import { APP_ROUTES } from '../../src/core/constants';
import { SETTINGS } from '../../src/core/settings';
import { runDB, stopDb } from '../../src/db';
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
    server.close();
    await stopDb();
  };

  return {
    request,
    closeSession,
    clearDb,
    server,
  };
};

export type TestContextType = Awaited<ReturnType<typeof setupTestContext>>;
