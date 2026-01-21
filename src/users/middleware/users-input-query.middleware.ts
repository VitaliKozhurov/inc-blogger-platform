import { query } from 'express-validator';

import { checkValidationMiddleware, sortAndPaginationMiddleware } from '../../core/middleware';
import { UserSortFields } from '../types/user-fields';

const USER_QUERY_FIELDS = {
  SEARCH_LOGIN_TERM: 'searchLoginTerm',
  SEARCH_EMAIL_TERM: 'searchEmailTerm',
};

export const usersInputQueryMiddleware = [
  query(USER_QUERY_FIELDS.SEARCH_LOGIN_TERM).optional().isString().trim(),
  query(USER_QUERY_FIELDS.SEARCH_EMAIL_TERM).optional().isString().trim(),
  ...sortAndPaginationMiddleware(UserSortFields),
  checkValidationMiddleware,
];
