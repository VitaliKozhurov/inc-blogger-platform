export const ERROR_FIELD_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  IS_STRING: (field: string) => `${field} must be a string`,
  LENGTH_RANGE: ({ field, min, max }: { field: string; min: number; max: number }) =>
    `${field} must be between ${min} and ${max} symbols`,
  IS_URL: (field: string) => `${field} must be a valid URL`,
};
