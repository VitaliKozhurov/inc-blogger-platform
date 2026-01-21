import { SortDirection } from '../types/sort';

export const ERROR_FIELD_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  IS_STRING: (field: string) => `${field} must be a string`,
  NOT_EMPTY: (field: string) => `${field} must not be empty`,
  LENGTH_RANGE: ({ field, min, max }: { field: string; min: number; max: number }) =>
    `${field} must be between ${min} and ${max} symbols`,
  IS_URL: (field: string) => `${field} must be a valid URL`,
  MUST_BE_OBJECT_ID: (field: string) => `${field} must be of mongo id format`,
  PAGE_NUMBER: () => 'Page number must be a positive number',
  PAGE_SIZE: ({ min, max }: { min: number; max: number }) =>
    `Page size must be between ${min} and ${max}`,
  SORT_BY: (correctFields: string[]) =>
    `Invalid sort field. Sort fields must be from list of ${correctFields.join(', ')} values`,
  SORT_DIRECTION: (correctSortDirection: SortDirection[]) =>
    `Invalid sort direction. Sort  direction must be from ${Object.values(correctSortDirection).join(', ')} values`,
};
