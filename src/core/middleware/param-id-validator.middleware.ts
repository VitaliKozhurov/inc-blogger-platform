import { param } from 'express-validator';

import { PARAM_ID_ERROR_MESSAGES } from '../constants';

import { checkValidationMiddleware } from './check-validation.middleware';

export const getUriParamValidatorMiddleware = (uriParam: string = 'id') => {
  return [
    param(uriParam)
      .exists()
      .withMessage(PARAM_ID_ERROR_MESSAGES.REQUIRED)
      .notEmpty()
      .withMessage(PARAM_ID_ERROR_MESSAGES.NOT_EMPTY)
      .isString()
      .withMessage(PARAM_ID_ERROR_MESSAGES.MUST_BE_STRING)
      .isNumeric({ no_symbols: true })
      .withMessage(PARAM_ID_ERROR_MESSAGES.MUST_BE_NUMERIC),

    checkValidationMiddleware,
  ];
};

export const idUriParamValidatorMiddleware = getUriParamValidatorMiddleware();
