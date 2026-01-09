import { ValidationErrorType } from '../types';

export const createErrorMessages = (errors: ValidationErrorType[]) => {
  return { errorMessages: errors };
};
