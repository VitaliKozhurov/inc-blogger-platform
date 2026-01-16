import { SortDirection } from '../types/sort';

export const DEFAULT_QUERY_PARAMS = {
  PAGE_NUMBER: 1,
  PAGE_SIZE: 10,
  SORT_BY: 'createdAt',
  SORT_DIRECTION: SortDirection.DESC,
};
