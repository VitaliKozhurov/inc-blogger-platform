import { Router } from 'express';

import { APP_ROUTES } from '../../core/constants';

import { clearDBHandler } from './handlers/clear-db.handler';

export const testRouter = Router();

testRouter.delete(APP_ROUTES.CLEAR_DATA, clearDBHandler);
