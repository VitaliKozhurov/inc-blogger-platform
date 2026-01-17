import { checkValidationMiddleware } from '../../core/middleware';
import { postValidator } from '../validation/post-validator';

export const postInputModelMiddleware = [
  postValidator.blogId,
  postValidator.title,
  postValidator.shortDescription,
  postValidator.content,
  checkValidationMiddleware,
];

export const postByBlogIdInputModelMiddleware = [
  postValidator.title,
  postValidator.shortDescription,
  postValidator.content,
  checkValidationMiddleware,
];
