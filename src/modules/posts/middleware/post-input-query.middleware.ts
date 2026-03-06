import { sortAndPaginationMiddleware } from '../../../core/middleware';
import { PostSortFields } from '../types/post-sort-field.dto';

export const postInputQueryMiddleware = [...sortAndPaginationMiddleware(PostSortFields)];
