import { sortAndPaginationMiddleware } from '../../core/middleware';
import { CommentSortFields } from '../types';

export const commentInputQueryMiddleware = [...sortAndPaginationMiddleware(CommentSortFields)];
