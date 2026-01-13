import { Express } from 'express';
import request from 'supertest';

import { APP_ROUTES } from '../../src/core/constants';
import { SETTINGS } from '../../src/core/settings';
import { runDB } from '../../src/db';
import { initApp } from '../../src/init-app';

export const setupTestEnvironments = async (app: Express) => {
  await runDB(SETTINGS.MONGO_URL);
  await request(app).delete(`${APP_ROUTES.TESTING}${APP_ROUTES.CLEAR_DATA}`);
  const server = await initApp(app);

  return server;
};
