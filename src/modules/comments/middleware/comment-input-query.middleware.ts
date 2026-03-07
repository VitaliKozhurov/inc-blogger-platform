import { sortAndPaginationMiddleware } from '../../../core/middleware';
import { CommentSortFields } from '../types/comment-sort-field.types';

export const commentInputQueryMiddleware = [...sortAndPaginationMiddleware(CommentSortFields)];
