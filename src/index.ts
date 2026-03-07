import express from 'express';
import 'reflect-metadata';

import { runDB } from './config/mongo.db';
import { SETTINGS } from './config/settings';
import { initApp } from './init-app';

const bootstrap = async () => {
  const app = express();

  await runDB(SETTINGS.MONGO_URL);

  await initApp(app);

  return app;
};

bootstrap();
