import { body, ValidationChain } from 'express-validator';

import { BlogInputType } from '../types/blog';

type BlogValidatorType = Record<keyof BlogInputType, ValidationChain>;

export const blogValidator: BlogValidatorType = {
  name: body('name')
    .exists()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage('Name must be between 1 and 15 symbols'),
  description: body('description')
    .exists()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 symbols'),
  websiteUrl: body('websiteUrl')
    .exists()
    .withMessage('WebsiteUrl is required')
    .isString()
    .withMessage('WebsiteUrl must be a string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('WebsiteUrl must be between 1 and 500 symbols')
    .isURL()
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage('WebsiteUrl must be a valid URL'),
};
