import { Router } from 'express';

import { APP_ROUTES } from '../../core/constants';
import { checkValidationMiddleware } from '../../core/middleware';
import {
  accessTokenMiddleware,
  loginInputModelMiddleware,
  refreshTokenMiddleware,
  registrationConfirmationInputModelMiddleware,
  registrationEmailResendingInputModelMiddleware,
  registrationInputModelMiddleware,
} from '../middleware';

import { loginHandler } from './handlers/login.handler';
import { logoutHandler } from './handlers/logout.handler';
import { meHandler } from './handlers/me.handler';
import { refreshTokenHandler } from './handlers/refresh-token.handler';
import { registrationConfirmationHandler } from './handlers/registration-confirmation.handler';
import { registrationEmailResendingHandler } from './handlers/registration-email-resending.handler';
import { registrationHandler } from './handlers/registration.handler';

export const authRouter = Router();

authRouter.post(
  APP_ROUTES.AUTH_LOGIN,
  loginInputModelMiddleware,
  checkValidationMiddleware,
  loginHandler
);

authRouter.get(APP_ROUTES.AUTH_ME, accessTokenMiddleware, meHandler);

authRouter.post(
  `${APP_ROUTES.AUTH_REGISTRATION}`,
  registrationInputModelMiddleware,
  checkValidationMiddleware,
  registrationHandler
);

authRouter.post(
  APP_ROUTES.AUTH_REGISTRATION_CONFIRMATION,
  registrationConfirmationInputModelMiddleware,
  checkValidationMiddleware,
  registrationConfirmationHandler
);

authRouter.post(
  APP_ROUTES.AUTH_REGISTRATION_EMAIL_RESENDING,
  registrationEmailResendingInputModelMiddleware,
  checkValidationMiddleware,
  registrationEmailResendingHandler
);

authRouter.post(APP_ROUTES.AUTH_REFRESH_TOKEN, refreshTokenMiddleware, refreshTokenHandler);

authRouter.post(APP_ROUTES.AUTH_LOGOUT, refreshTokenMiddleware, logoutHandler);
