import { SortDirection } from '../../../core/types/sort';
import { PostFields } from '../types/post-fields.types';

export type PostsRequestQueryDTO = {
  sortBy: PostFields.CREATED_AT;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
