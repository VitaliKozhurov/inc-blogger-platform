import { body, ValidationChain } from 'express-validator';

import { ERROR_FIELD_MESSAGES } from '../../core/utils';
import { PostFields, PostType } from '../types/post';

import { POST_VALIDATION_LENGTH } from './validation-length';

type PostValidationType = Record<Exclude<keyof PostType, 'id' | 'blogName'>, ValidationChain>;

export const postValidator: PostValidationType = {
  [PostFields.BLOG_ID]: body(PostFields.BLOG_ID)
    .exists()
    .withMessage(ERROR_FIELD_MESSAGES.REQUIRED(PostFields.BLOG_ID))
    .isString()
    .withMessage(ERROR_FIELD_MESSAGES.IS_STRING(PostFields.BLOG_ID))
    .trim()
    .notEmpty()
    .withMessage(ERROR_FIELD_MESSAGES.NOT_EMPTY(PostFields.BLOG_ID)),
  [PostFields.TITLE]: body(PostFields.TITLE)
    .exists()
    .withMessage(ERROR_FIELD_MESSAGES.REQUIRED(PostFields.TITLE))
    .isString()
    .withMessage(ERROR_FIELD_MESSAGES.IS_STRING(PostFields.TITLE))
    .trim()
    .isLength({ min: POST_VALIDATION_LENGTH.title.min, max: POST_VALIDATION_LENGTH.title.max })
    .withMessage(
      ERROR_FIELD_MESSAGES.LENGTH_RANGE({
        field: PostFields.TITLE,
        min: POST_VALIDATION_LENGTH.title.min,
        max: POST_VALIDATION_LENGTH.title.max,
      })
    ),
  [PostFields.SHORT_DESCRIPTION]: body(PostFields.SHORT_DESCRIPTION)
    .exists()
    .withMessage(ERROR_FIELD_MESSAGES.REQUIRED(PostFields.SHORT_DESCRIPTION))
    .isString()
    .withMessage(ERROR_FIELD_MESSAGES.IS_STRING(PostFields.SHORT_DESCRIPTION))
    .trim()
    .isLength({
      min: POST_VALIDATION_LENGTH.shortDescription.min,
      max: POST_VALIDATION_LENGTH.shortDescription.max,
    })
    .withMessage(
      ERROR_FIELD_MESSAGES.LENGTH_RANGE({
        field: PostFields.SHORT_DESCRIPTION,
        min: POST_VALIDATION_LENGTH.shortDescription.min,
        max: POST_VALIDATION_LENGTH.shortDescription.max,
      })
    ),
  [PostFields.CONTENT]: body(PostFields.CONTENT)
    .exists()
    .withMessage(ERROR_FIELD_MESSAGES.REQUIRED(PostFields.CONTENT))
    .isString()
    .withMessage(ERROR_FIELD_MESSAGES.IS_STRING(PostFields.CONTENT))
    .trim()
    .isLength({ min: POST_VALIDATION_LENGTH.content.min, max: POST_VALIDATION_LENGTH.content.max })
    .withMessage(
      ERROR_FIELD_MESSAGES.LENGTH_RANGE({
        field: PostFields.CONTENT,
        min: POST_VALIDATION_LENGTH.content.min,
        max: POST_VALIDATION_LENGTH.content.max,
      })
    ),
};
