import { body } from 'express-validator';

import { ERROR_FIELD_MESSAGES } from '../../core/utils';
import { CommentFields } from '../types';

export const COMMENT_VALIDATION_LENGTH = {
  [CommentFields.CONTENT]: { min: 20, max: 300 },
};

export const commentInputModelMiddleware = body(CommentFields.CONTENT)
  .exists()
  .withMessage(ERROR_FIELD_MESSAGES.REQUIRED(CommentFields.CONTENT))
  .isString()
  .withMessage(ERROR_FIELD_MESSAGES.IS_STRING(CommentFields.CONTENT))
  .trim()
  .isLength({
    min: COMMENT_VALIDATION_LENGTH.content.min,
    max: COMMENT_VALIDATION_LENGTH.content.max,
  })
  .withMessage(
    ERROR_FIELD_MESSAGES.LENGTH_RANGE({
      field: CommentFields.CONTENT,
      min: COMMENT_VALIDATION_LENGTH.content.min,
      max: COMMENT_VALIDATION_LENGTH.content.max,
    })
  );
