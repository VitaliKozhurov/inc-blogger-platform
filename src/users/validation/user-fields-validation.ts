import { body, ValidationChain } from 'express-validator';

import { EMAIL_REG_EXP } from '../../core/constants';
import { ERROR_FIELD_MESSAGES } from '../../core/utils';
import { CreateUserInputType, UserFields } from '../types';

type UserFieldsValidationType = Record<keyof CreateUserInputType, ValidationChain>;

export const USER_VALIDATION_LENGTH = {
  [UserFields.LOGIN]: { min: 3, max: 10 },
  [UserFields.PASSWORD]: { min: 6, max: 20 },
};

export const USER_LOGIN_REG_EXP = /^[a-zA-Z0-9_-]*$/;

export const userFieldsValidation: Omit<UserFieldsValidationType, 'emailConfirmation'> = {
  [UserFields.LOGIN]: body(UserFields.LOGIN)
    .exists()
    .withMessage(ERROR_FIELD_MESSAGES.REQUIRED(UserFields.LOGIN))
    .isString()
    .withMessage(ERROR_FIELD_MESSAGES.IS_STRING(UserFields.LOGIN))
    .trim()
    .isLength({ min: USER_VALIDATION_LENGTH.login.min, max: USER_VALIDATION_LENGTH.login.max })
    .withMessage(
      ERROR_FIELD_MESSAGES.LENGTH_RANGE({
        field: UserFields.LOGIN,
        min: USER_VALIDATION_LENGTH.login.min,
        max: USER_VALIDATION_LENGTH.login.max,
      })
    )
    .matches(USER_LOGIN_REG_EXP)
    .withMessage(ERROR_FIELD_MESSAGES.PATTERN(UserFields.LOGIN)),
  [UserFields.PASSWORD]: body(UserFields.PASSWORD)
    .exists()
    .withMessage(ERROR_FIELD_MESSAGES.REQUIRED(UserFields.PASSWORD))
    .isString()
    .withMessage(ERROR_FIELD_MESSAGES.IS_STRING(UserFields.PASSWORD))
    .trim()
    .isLength({
      min: USER_VALIDATION_LENGTH.password.min,
      max: USER_VALIDATION_LENGTH.password.max,
    })
    .withMessage(
      ERROR_FIELD_MESSAGES.LENGTH_RANGE({
        field: UserFields.PASSWORD,
        min: USER_VALIDATION_LENGTH.password.min,
        max: USER_VALIDATION_LENGTH.password.max,
      })
    ),
  [UserFields.EMAIL]: body(UserFields.EMAIL)
    .exists()
    .withMessage(ERROR_FIELD_MESSAGES.REQUIRED(UserFields.EMAIL))
    .isString()
    .withMessage(ERROR_FIELD_MESSAGES.IS_STRING(UserFields.EMAIL))
    .matches(EMAIL_REG_EXP)
    .withMessage(ERROR_FIELD_MESSAGES.PATTERN(UserFields.EMAIL)),
};
