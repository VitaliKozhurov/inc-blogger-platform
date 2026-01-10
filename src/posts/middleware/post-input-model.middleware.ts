import { checkValidationMiddleware } from '../../core/validation';
import { postValidator } from '../validation/post-validator';

export const postInputModelMiddleware = [
  postValidator.blogId,
  postValidator.title,
  postValidator.shortDescription,
  postValidator.content,
  checkValidationMiddleware,
];
