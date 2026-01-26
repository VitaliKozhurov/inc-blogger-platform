import { postFieldsValidation } from '../validation/post-fields-validation';

export const postInputModelMiddleware = [
  postFieldsValidation.blogId,
  postFieldsValidation.title,
  postFieldsValidation.shortDescription,
  postFieldsValidation.content,
];

export const postByBlogIdInputModelMiddleware = [
  postFieldsValidation.title,
  postFieldsValidation.shortDescription,
  postFieldsValidation.content,
];
