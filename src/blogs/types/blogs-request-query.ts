import { Nullable } from '../../core/types';
import { SortDirection } from '../../core/types/sort';

import { BlogSortFields } from './blog-fields';

export type BlogsRequestQueryType = {
  searchNameTerm: Nullable<string>;
  sortBy: BlogSortFields;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
