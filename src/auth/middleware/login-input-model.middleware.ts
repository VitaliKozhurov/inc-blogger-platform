import { checkValidationMiddleware } from '../../core/middleware';
import { loginFieldsValidation } from '../validation/login-fields-validation';

export const loginInputModelMiddleware = [
  loginFieldsValidation.loginOrEmail,
  loginFieldsValidation.password,
  checkValidationMiddleware,
];
