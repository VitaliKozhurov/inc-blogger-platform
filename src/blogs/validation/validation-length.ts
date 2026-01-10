import { BlogFields } from '../types/blog';

export const BLOG_VALIDATION_LENGTH = {
  [BlogFields.NAME]: { min: 1, max: 15 },
  [BlogFields.DESCRIPTION]: { min: 1, max: 500 },
  [BlogFields.WEBSITE_URL]: { min: 1, max: 100 },
};
