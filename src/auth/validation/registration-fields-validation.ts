import { body, ValidationChain } from 'express-validator';

import { EMAIL_REG_EXP, LOGIN_REG_EXP } from '../../core/constants';
import { ERROR_FIELD_MESSAGES } from '../../core/utils';
import { AuthFields, RegistrationInputType } from '../types';

type LoginValidationType = Record<keyof RegistrationInputType, ValidationChain>;

export const REGISTRATION_VALIDATION_LENGTH = {
  [AuthFields.LOGIN]: { min: 3, max: 10 },
  [AuthFields.PASSWORD]: { min: 6, max: 20 },
};

export const registrationFieldsValidation: LoginValidationType = {
  [AuthFields.LOGIN]: body(AuthFields.LOGIN)
    .exists()
    .withMessage(ERROR_FIELD_MESSAGES.REQUIRED(AuthFields.LOGIN))
    .isString()
    .withMessage(ERROR_FIELD_MESSAGES.IS_STRING(AuthFields.LOGIN))
    .trim()
    .notEmpty()
    .withMessage(ERROR_FIELD_MESSAGES.NOT_EMPTY(AuthFields.LOGIN))
    .isLength({
      min: REGISTRATION_VALIDATION_LENGTH.login.min,
      max: REGISTRATION_VALIDATION_LENGTH.login.max,
    })
    .withMessage(
      ERROR_FIELD_MESSAGES.LENGTH_RANGE({
        field: AuthFields.LOGIN,
        min: REGISTRATION_VALIDATION_LENGTH.login.min,
        max: REGISTRATION_VALIDATION_LENGTH.login.max,
      })
    )
    .matches(LOGIN_REG_EXP)
    .withMessage(ERROR_FIELD_MESSAGES.PATTERN(AuthFields.LOGIN)),
  [AuthFields.PASSWORD]: body(AuthFields.PASSWORD)
    .exists()
    .withMessage(ERROR_FIELD_MESSAGES.REQUIRED(AuthFields.PASSWORD))
    .isString()
    .withMessage(ERROR_FIELD_MESSAGES.IS_STRING(AuthFields.PASSWORD))
    .trim()
    .notEmpty()
    .withMessage(ERROR_FIELD_MESSAGES.NOT_EMPTY(AuthFields.PASSWORD))
    .isLength({
      min: REGISTRATION_VALIDATION_LENGTH.password.min,
      max: REGISTRATION_VALIDATION_LENGTH.password.max,
    })
    .withMessage(
      ERROR_FIELD_MESSAGES.LENGTH_RANGE({
        field: AuthFields.PASSWORD,
        min: REGISTRATION_VALIDATION_LENGTH.password.min,
        max: REGISTRATION_VALIDATION_LENGTH.password.max,
      })
    ),
  [AuthFields.EMAIL]: body(AuthFields.EMAIL)
    .exists()
    .withMessage(ERROR_FIELD_MESSAGES.REQUIRED(AuthFields.EMAIL))
    .isString()
    .withMessage(ERROR_FIELD_MESSAGES.IS_STRING(AuthFields.EMAIL))
    .trim()
    .notEmpty()
    .withMessage(ERROR_FIELD_MESSAGES.NOT_EMPTY(AuthFields.EMAIL))
    .matches(EMAIL_REG_EXP)
    .withMessage(ERROR_FIELD_MESSAGES.PATTERN(AuthFields.EMAIL)),
};
