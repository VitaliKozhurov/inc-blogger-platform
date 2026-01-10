import { body, ValidationChain } from 'express-validator';

import { URL_REG_EXP } from '../../core/constants';
import { ERROR_FIELD_MESSAGES } from '../../core/utils';
import { BlogFields, BlogInputType } from '../types/blog';

import { BLOG_VALIDATION_LENGTH } from './validation-length';

type BlogValidatorType = Record<keyof BlogInputType, ValidationChain>;

export const blogValidator: BlogValidatorType = {
  [BlogFields.NAME]: body(BlogFields.NAME)
    .exists()
    .withMessage(ERROR_FIELD_MESSAGES.REQUIRED(BlogFields.NAME))
    .isString()
    .withMessage(ERROR_FIELD_MESSAGES.IS_STRING(BlogFields.NAME))
    .trim()
    .isLength({ min: BLOG_VALIDATION_LENGTH.name.min, max: BLOG_VALIDATION_LENGTH.name.max })
    .withMessage(
      ERROR_FIELD_MESSAGES.LENGTH_RANGE({
        field: BlogFields.NAME,
        min: BLOG_VALIDATION_LENGTH.name.min,
        max: BLOG_VALIDATION_LENGTH.name.max,
      })
    ),
  [BlogFields.DESCRIPTION]: body(BlogFields.DESCRIPTION)
    .exists()
    .withMessage(ERROR_FIELD_MESSAGES.REQUIRED(BlogFields.DESCRIPTION))
    .isString()
    .withMessage(ERROR_FIELD_MESSAGES.IS_STRING(BlogFields.DESCRIPTION))
    .trim()
    .isLength({
      min: BLOG_VALIDATION_LENGTH.description.min,
      max: BLOG_VALIDATION_LENGTH.description.max,
    })
    .withMessage(
      ERROR_FIELD_MESSAGES.LENGTH_RANGE({
        field: BlogFields.DESCRIPTION,
        min: BLOG_VALIDATION_LENGTH.description.min,
        max: BLOG_VALIDATION_LENGTH.description.max,
      })
    ),
  [BlogFields.WEBSITE_URL]: body(BlogFields.WEBSITE_URL)
    .exists()
    .withMessage(ERROR_FIELD_MESSAGES.REQUIRED(BlogFields.WEBSITE_URL))
    .isString()
    .withMessage(ERROR_FIELD_MESSAGES.IS_STRING(BlogFields.WEBSITE_URL))
    .trim()
    .isLength({
      min: BLOG_VALIDATION_LENGTH.websiteUrl.min,
      max: BLOG_VALIDATION_LENGTH.websiteUrl.max,
    })
    .withMessage(
      ERROR_FIELD_MESSAGES.LENGTH_RANGE({
        field: BlogFields.WEBSITE_URL,
        min: BLOG_VALIDATION_LENGTH.websiteUrl.min,
        max: BLOG_VALIDATION_LENGTH.websiteUrl.max,
      })
    )
    .isURL()
    .matches(URL_REG_EXP)
    .withMessage(ERROR_FIELD_MESSAGES.IS_URL(BlogFields.WEBSITE_URL)),
};
