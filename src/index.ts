import express from 'express';

import { SETTINGS } from './core/settings';
import { runDB } from './db/mongo.db';
import { initApp } from './init-app';

const bootstrap = async () => {
  const app = express();

  await runDB(SETTINGS.MONGO_URL);

  await initApp(app);

  return app;
};

bootstrap();
