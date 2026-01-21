import { query } from 'express-validator';

import { checkValidationMiddleware, sortAndPaginationMiddleware } from '../../core/middleware';
import { BlogSortFields } from '../types';

const QUERY_FIELDS = {
  SEARCH_NAME_TERM: 'searchNameTerm',
};

export const blogInputQueryMiddleware = [
  query(QUERY_FIELDS.SEARCH_NAME_TERM).optional().isString().trim(),
  ...sortAndPaginationMiddleware(BlogSortFields),
  checkValidationMiddleware,
];
