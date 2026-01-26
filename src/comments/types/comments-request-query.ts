import { SortDirection } from '../../core/types/sort';

import { CommentsSortFields } from './comment-fields';

export type CommentsRequestQueryType = {
  searchNameTerm?: string;
  sortBy: CommentsSortFields;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
