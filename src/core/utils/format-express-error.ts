import { FieldValidationError, ValidationError } from 'express-validator';

export const formatExpressError = (error: ValidationError) => {
  const { path, msg } = error as unknown as FieldValidationError;

  return {
    field: path,
    message: msg,
  };
};
