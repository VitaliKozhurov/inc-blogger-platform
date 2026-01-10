import { BlogFields, BlogInputType } from '../types/blog';

type BlogValidationLengthType = {
  [key in keyof BlogInputType]: { min: number; max: number };
};

export const BLOG_VALIDATION_LENGTH: BlogValidationLengthType = {
  [BlogFields.NAME]: { min: 1, max: 15 },
  [BlogFields.DESCRIPTION]: { min: 1, max: 500 },
  [BlogFields.WEBSITE_URL]: { min: 1, max: 100 },
};
