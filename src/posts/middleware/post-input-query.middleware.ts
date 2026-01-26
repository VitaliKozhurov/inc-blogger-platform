import { sortAndPaginationMiddleware } from '../../core/middleware';
import { PostSortFields } from '../types';

export const postInputQueryMiddleware = [...sortAndPaginationMiddleware(PostSortFields)];
