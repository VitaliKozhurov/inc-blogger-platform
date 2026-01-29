import { body } from 'express-validator';

import { ERROR_FIELD_MESSAGES } from '../../core/utils';

export const registrationConfirmationInputModelMiddleware = body('code')
  .exists()
  .withMessage(ERROR_FIELD_MESSAGES.REQUIRED('code'))
  .isString()
  .withMessage(ERROR_FIELD_MESSAGES.IS_STRING('code'))
  .trim()
  .notEmpty();
