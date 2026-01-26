import { param } from 'express-validator';

import { PARAM_ID_ERROR_MESSAGES } from '../constants';

export const getUriParamValidatorMiddleware = (uriParam: string = 'id') => {
  return [
    param(uriParam)
      .exists()
      .withMessage(PARAM_ID_ERROR_MESSAGES.REQUIRED)
      .notEmpty()
      .withMessage(PARAM_ID_ERROR_MESSAGES.NOT_EMPTY)
      .isString()
      .withMessage(PARAM_ID_ERROR_MESSAGES.MUST_BE_STRING)
      .isMongoId()
      .withMessage(PARAM_ID_ERROR_MESSAGES.MUST_BE_OBJECT_ID),
  ];
};

export const idUriParamMiddleware = getUriParamValidatorMiddleware();
