import dotenv from 'dotenv';
import express from 'express';

import { SETTINGS } from './core/settings';
import { runDB } from './db/mongo.db';
import { initApp } from './init-app';

dotenv.config();

const bootstrap = async () => {
  const app = express();

  await runDB(SETTINGS.MONGO_URL);

  await initApp(app);

  return app;
};

bootstrap();
