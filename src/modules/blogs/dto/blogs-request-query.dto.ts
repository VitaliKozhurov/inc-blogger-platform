import { SortDirection } from '../../../core/types/sort';
import { BlogSortFields } from '../types/blog-sort-fields.types';

export type BlogsRequestQueryDTO = {
  searchNameTerm?: string;
  sortBy: BlogSortFields;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
