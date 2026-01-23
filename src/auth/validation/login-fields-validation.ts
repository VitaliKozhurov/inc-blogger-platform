import { body, ValidationChain } from 'express-validator';

import { ERROR_FIELD_MESSAGES } from '../../core/utils';
import { LoginFields } from '../types';

type LoginValidationType = Record<'loginOrEmail' | 'password', ValidationChain>;

export const loginFieldsValidation: LoginValidationType = {
  [LoginFields.LOGIN_OR_EMAIL]: body(LoginFields.LOGIN_OR_EMAIL)
    .exists()
    .withMessage(ERROR_FIELD_MESSAGES.REQUIRED(LoginFields.LOGIN_OR_EMAIL))
    .isString()
    .withMessage(ERROR_FIELD_MESSAGES.IS_STRING(LoginFields.LOGIN_OR_EMAIL))
    .trim()
    .notEmpty()
    .withMessage(ERROR_FIELD_MESSAGES.NOT_EMPTY(LoginFields.LOGIN_OR_EMAIL)),
  [LoginFields.PASSWORD]: body(LoginFields.PASSWORD)
    .exists()
    .withMessage(ERROR_FIELD_MESSAGES.REQUIRED(LoginFields.PASSWORD))
    .isString()
    .withMessage(ERROR_FIELD_MESSAGES.IS_STRING(LoginFields.PASSWORD))
    .trim()
    .notEmpty()
    .withMessage(ERROR_FIELD_MESSAGES.NOT_EMPTY(LoginFields.PASSWORD)),
};
