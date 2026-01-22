import { SortDirection } from '../../core/types/sort';

import { PostFields } from './post-fields';

export type PostsRequestQueryType = {
  sortBy: PostFields.CREATED_AT;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
