import { body, ValidationChain } from 'express-validator';

import { ERROR_FIELD_MESSAGES } from '../../core/utils';
import { CreatePostInputType, PostFields } from '../types';

type PostValidationType = Record<keyof CreatePostInputType, ValidationChain>;

export const POST_VALIDATION_LENGTH = {
  [PostFields.TITLE]: { min: 1, max: 30 },
  [PostFields.SHORT_DESCRIPTION]: { min: 1, max: 100 },
  [PostFields.CONTENT]: { min: 1, max: 1000 },
};

export const postValidator: PostValidationType = {
  [PostFields.BLOG_ID]: body(PostFields.BLOG_ID)
    .exists()
    .withMessage(ERROR_FIELD_MESSAGES.REQUIRED(PostFields.BLOG_ID))
    .isString()
    .withMessage(ERROR_FIELD_MESSAGES.IS_STRING(PostFields.BLOG_ID))
    .trim()
    .notEmpty()
    .withMessage(ERROR_FIELD_MESSAGES.NOT_EMPTY(PostFields.BLOG_ID))
    .isMongoId()
    .withMessage(ERROR_FIELD_MESSAGES.MUST_BE_OBJECT_ID(PostFields.BLOG_ID)),
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
