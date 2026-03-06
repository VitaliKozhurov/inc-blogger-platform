import { SortDirection } from '../../../core/types/sort';
import { CommentSortFields } from '../types/comment-sort-field.types';

export type CommentsRequestQueryDTO = {
  searchNameTerm?: string;
  sortBy: CommentSortFields;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
