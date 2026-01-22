import { checkValidationMiddleware } from '../../core/middleware';
import { userFieldsValidation } from '../validation/user-fields-validation';

export const userInputModelMiddleware = [
  userFieldsValidation.login,
  userFieldsValidation.email,
  userFieldsValidation.password,
  checkValidationMiddleware,
];
