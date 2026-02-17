import { Router } from 'express';

import { iocContainer } from '../../composition-root';
import { APP_ROUTES } from '../../core/constants';
import { checkValidationMiddleware } from '../../core/middleware';
import { getRateLimitMiddleware } from '../../logs/middleware';
import { AuthController } from '../controller/auth.controller';
import {
  accessTokenMiddleware,
  loginInputModelMiddleware,
  refreshTokenMiddleware,
  registrationConfirmationInputModelMiddleware,
  registrationEmailResendingInputModelMiddleware,
  registrationInputModelMiddleware,
} from '../middleware';

const authService = iocContainer.get(AuthController);

export const authRouter = Router();

authRouter.post(
  APP_ROUTES.AUTH_LOGIN,
  getRateLimitMiddleware(),
  loginInputModelMiddleware,
  checkValidationMiddleware,
  authService.login
);

authRouter.get(APP_ROUTES.AUTH_ME, accessTokenMiddleware, authService.me);

authRouter.post(
  APP_ROUTES.AUTH_REGISTRATION,
  getRateLimitMiddleware(),
  registrationInputModelMiddleware,
  checkValidationMiddleware,
  authService.registration
);

authRouter.post(
  APP_ROUTES.AUTH_REGISTRATION_CONFIRMATION,
  getRateLimitMiddleware(),
  registrationConfirmationInputModelMiddleware,
  checkValidationMiddleware,
  authService.registrationConfirmation
);

authRouter.post(
  APP_ROUTES.AUTH_REGISTRATION_EMAIL_RESENDING,
  getRateLimitMiddleware(),
  registrationEmailResendingInputModelMiddleware,
  checkValidationMiddleware,
  authService.registrationEmailResending
);

authRouter.post(APP_ROUTES.AUTH_REFRESH_TOKEN, refreshTokenMiddleware, authService.refreshToken);

authRouter.post(APP_ROUTES.AUTH_LOGOUT, refreshTokenMiddleware, authService.logout);
