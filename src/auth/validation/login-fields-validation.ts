import { body, ValidationChain } from 'express-validator';

import { ERROR_FIELD_MESSAGES } from '../../core/utils';
import { AuthFields } from '../types';

type LoginValidationType = Record<'loginOrEmail' | 'password', ValidationChain>;

export const loginFieldsValidation: LoginValidationType = {
  [AuthFields.LOGIN_OR_EMAIL]: body(AuthFields.LOGIN_OR_EMAIL)
    .exists()
    .withMessage(ERROR_FIELD_MESSAGES.REQUIRED(AuthFields.LOGIN_OR_EMAIL))
    .isString()
    .withMessage(ERROR_FIELD_MESSAGES.IS_STRING(AuthFields.LOGIN_OR_EMAIL))
    .trim()
    .notEmpty()
    .withMessage(ERROR_FIELD_MESSAGES.NOT_EMPTY(AuthFields.LOGIN_OR_EMAIL)),
  [AuthFields.PASSWORD]: body(AuthFields.PASSWORD)
    .exists()
    .withMessage(ERROR_FIELD_MESSAGES.REQUIRED(AuthFields.PASSWORD))
    .isString()
    .withMessage(ERROR_FIELD_MESSAGES.IS_STRING(AuthFields.PASSWORD))
    .trim()
    .notEmpty()
    .withMessage(ERROR_FIELD_MESSAGES.NOT_EMPTY(AuthFields.PASSWORD)),
};
