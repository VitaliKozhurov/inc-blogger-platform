import { SortDirection } from '../../core/types/sort';

import { BlogSortFields } from './blog-fields';

export type BlogsRequestQueryType = {
  searchNameTerm?: string;
  sortBy: BlogSortFields;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
