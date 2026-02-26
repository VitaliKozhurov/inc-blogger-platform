import { body } from 'express-validator';

import { ERROR_FIELD_MESSAGES } from '../../core/utils';
import { AuthFields } from '../types';

export const newPasswordInputModelMiddleware = [
  body(AuthFields.NEW_PASSWORD)
    .exists()
    .withMessage(ERROR_FIELD_MESSAGES.REQUIRED(AuthFields.NEW_PASSWORD))
    .isString()
    .withMessage(ERROR_FIELD_MESSAGES.IS_STRING(AuthFields.NEW_PASSWORD))
    .trim()
    .notEmpty()
    .withMessage(ERROR_FIELD_MESSAGES.NOT_EMPTY(AuthFields.NEW_PASSWORD))
    .isLength({ min: 6, max: 20 })
    .withMessage(
      ERROR_FIELD_MESSAGES.LENGTH_RANGE({
        field: AuthFields.NEW_PASSWORD,
        min: 6,
        max: 20,
      })
    ),
];
