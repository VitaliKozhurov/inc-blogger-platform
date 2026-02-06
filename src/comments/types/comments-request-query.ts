import { SortDirection } from '../../core/types/sort';

import { CommentSortFields } from './comment-fields';

export type CommentsRequestQueryType = {
  searchNameTerm?: string;
  sortBy: CommentSortFields;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
