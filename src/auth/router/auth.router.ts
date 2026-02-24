import { Router } from 'express';

import { iocContainer } from '../../composition-root';
import { APP_ROUTES } from '../../core/constants';
import { checkValidationMiddleware } from '../../core/middleware';
import { getRateLimitMiddleware } from '../../logs/middleware';
import { AuthController } from '../controller/auth.controller';
import {
  accessTokenMiddleware,
  loginInputModelMiddleware,
  passwordRecoveryInputModelMiddleware,
  refreshTokenMiddleware,
  registrationConfirmationInputModelMiddleware,
  registrationEmailResendingInputModelMiddleware,
  registrationInputModelMiddleware,
} from '../middleware';

const authController = iocContainer.get(AuthController);

export const authRouter = Router();

authRouter.post(
  APP_ROUTES.AUTH_LOGIN,
  getRateLimitMiddleware(),
  loginInputModelMiddleware,
  checkValidationMiddleware,
  authController.login.bind(authController)
);

authRouter.get(APP_ROUTES.AUTH_ME, accessTokenMiddleware, authController.me.bind(authController));

authRouter.post(
  APP_ROUTES.AUTH_REGISTRATION,
  getRateLimitMiddleware(),
  registrationInputModelMiddleware,
  checkValidationMiddleware,
  authController.registration.bind(authController)
);

authRouter.post(
  APP_ROUTES.AUTH_REGISTRATION_CONFIRMATION,
  getRateLimitMiddleware(),
  registrationConfirmationInputModelMiddleware,
  checkValidationMiddleware,
  authController.registrationConfirmation.bind(authController)
);

authRouter.post(
  APP_ROUTES.AUTH_REGISTRATION_EMAIL_RESENDING,
  getRateLimitMiddleware(),
  registrationEmailResendingInputModelMiddleware,
  checkValidationMiddleware,
  authController.registrationEmailResending.bind(authController)
);

authRouter.post(
  APP_ROUTES.AUTH_REFRESH_TOKEN,
  refreshTokenMiddleware,
  authController.refreshToken.bind(authController)
);

authRouter.post(
  APP_ROUTES.AUTH_LOGOUT,
  refreshTokenMiddleware,
  authController.logout.bind(authController)
);

authRouter.post(
  APP_ROUTES.AUTH_PASSWORD_RECOVERY,
  getRateLimitMiddleware(),
  passwordRecoveryInputModelMiddleware,
  checkValidationMiddleware,
  authController.recoveryPassword.bind(authController)
);
