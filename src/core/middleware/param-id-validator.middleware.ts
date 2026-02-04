import { param } from 'express-validator';

const PARAM_ID_ERROR_MESSAGES = {
  REQUIRED: 'ID is required',
  NOT_EMPTY: 'ID must not be empty',
  MUST_BE_STRING: 'ID must be a string',
  MUST_BE_OBJECT_ID: 'ID must be of mongo id format',
};

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
