import { Express } from 'express';
import request from 'supertest';

import { APP_ROUTES } from '../../src/core/constants';

export const clearDb = async (app: Express) => {
  await request(app).delete(`${APP_ROUTES.TESTING}${APP_ROUTES.CLEAR_DATA}`);
};
