import { query } from 'express-validator';

import { DEFAULT_QUERY_PARAMS } from '../constants/default-query-params';
import { QueryFields } from '../types';
import { SortDirection } from '../types/sort';
import { ERROR_FIELD_MESSAGES } from '../utils';

import { checkValidationMiddleware } from './check-validation.middleware';

export const sortAndPaginationMiddleware = <T extends string>(sortFields: Record<string, T>) => {
  const allowedSortFields = Object.values(sortFields);

  return [
    query(QueryFields.PAGE_NUMBER)
      .default(DEFAULT_QUERY_PARAMS.PAGE_NUMBER)
      .isInt({ min: 1 })
      .withMessage(ERROR_FIELD_MESSAGES.PAGE_NUMBER())
      .toInt(),
    query(QueryFields.PAGE_SIZE)
      .default(DEFAULT_QUERY_PARAMS.PAGE_SIZE)
      .isInt({ min: 1, max: 100 })
      .withMessage(ERROR_FIELD_MESSAGES.PAGE_SIZE({ min: 1, max: 100 }))
      .toInt(),
    query(QueryFields.SORT_BY)
      .default(Object.values(allowedSortFields)[0])
      .isIn(allowedSortFields)
      .withMessage(ERROR_FIELD_MESSAGES.SORT_BY(allowedSortFields)),
    query(QueryFields.SORT_DIRECTION)
      .default(DEFAULT_QUERY_PARAMS.SORT_DIRECTION)
      .isIn(Object.values(SortDirection))
      .withMessage(ERROR_FIELD_MESSAGES.SORT_DIRECTION(Object.values(SortDirection))),

    checkValidationMiddleware,
  ];
};
