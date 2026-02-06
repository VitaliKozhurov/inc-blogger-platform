import { registrationFieldsValidation } from '../validation/registration-fields-validation';

export const registrationInputModelMiddleware = [
  registrationFieldsValidation.login,
  registrationFieldsValidation.password,
  registrationFieldsValidation.email,
];
