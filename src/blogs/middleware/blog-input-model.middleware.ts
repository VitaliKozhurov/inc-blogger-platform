import { checkValidationMiddleware } from '../../core/validation';
import { blogValidator } from '../validation/blog-validator';

export const blogInputModelMiddleware = [
  blogValidator.name,
  blogValidator.description,
  blogValidator.websiteUrl,
  checkValidationMiddleware,
];
