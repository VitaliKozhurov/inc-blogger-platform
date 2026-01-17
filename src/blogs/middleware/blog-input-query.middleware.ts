import { query } from 'express-validator';

import { checkValidationMiddleware } from '../../core/middleware';

const QUERY_FIELDS = {
  SEARCH_NAME_TERM: 'searchNameTerm',
};

export const blogInputQueryMiddleware = [
  query(QUERY_FIELDS.SEARCH_NAME_TERM).optional().isString().trim(),

  checkValidationMiddleware,
];
