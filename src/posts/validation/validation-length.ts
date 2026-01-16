import { PostFields } from '../types';

export const POST_VALIDATION_LENGTH = {
  [PostFields.TITLE]: { min: 1, max: 30 },
  [PostFields.SHORT_DESCRIPTION]: { min: 1, max: 100 },
  [PostFields.CONTENT]: { min: 1, max: 1000 },
};
