import { checkValidationMiddleware } from '../../core/middleware';
import { blogFieldsValidation } from '../validation/blog-fields-validation';

export const blogInputModelMiddleware = [
  blogFieldsValidation.name,
  blogFieldsValidation.description,
  blogFieldsValidation.websiteUrl,
  checkValidationMiddleware,
];
