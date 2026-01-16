import { PaginationType } from './pagination';
import { SortDirection } from './sort';

export type PaginationWithSorting<SortBy> = PaginationType & {
  sortBy: SortBy;
  sortDirection: SortDirection;
};
