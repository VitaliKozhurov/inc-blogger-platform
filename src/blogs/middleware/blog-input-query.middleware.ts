import { query } from 'express-validator';

import { checkValidationMiddleware, sortAndPaginationMiddleware } from '../../core/middleware';
import { BlogSortFields } from '../types';

const BLOGS_QUERY_FIELDS = {
  SEARCH_NAME_TERM: 'searchNameTerm',
};

export const blogInputQueryMiddleware = [
  query(BLOGS_QUERY_FIELDS.SEARCH_NAME_TERM).optional().isString().trim(),
  ...sortAndPaginationMiddleware(BlogSortFields),
  checkValidationMiddleware,
];
