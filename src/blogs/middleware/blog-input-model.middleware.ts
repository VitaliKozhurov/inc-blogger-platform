import { checkValidationMiddleware } from '../../core/middleware';
import { blogValidator } from '../validation/blog-validator';

export const blogInputModelMiddleware = [
  blogValidator.name,
  blogValidator.description,
  blogValidator.websiteUrl,
  checkValidationMiddleware,
];
