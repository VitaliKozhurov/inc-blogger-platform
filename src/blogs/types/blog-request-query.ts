import { Nullable } from '../../core/types';
import { SortDirection } from '../../core/types/sort';

import { BlogFields } from './blog-fields';

export type BlogRequestQueryType = {
  searchNameTerm: Nullable<string>;
  sortBy: BlogFields.NAME | BlogFields.CREATED_AT;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
