export const PARAM_ID_ERROR_MESSAGES = {
  REQUIRED: 'ID is required',
  NOT_EMPTY: 'ID must not be empty',
  MUST_BE_STRING: 'ID must be a string',
  MUST_BE_OBJECT_ID: 'ID must be of mongo id format',
};

export const PARAM_SORT_PAGINATION_MESSAGES = {
  PAGE_NUMBER: 'Page number must be a positive number',
  PAGE_SIZE: 'Page size must be between 1 and 100',
  SORT_BY: 'Invalid sort field',
  SORT_DIRECTION: 'Invalid sort direction value',
};
