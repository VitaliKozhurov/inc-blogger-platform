import { RESULT_STATUSES, ResultObject } from '../../../core/utils';

export const commentsObjectResult = {
  success<T>(data: T = null as T) {
    return new ResultObject({ status: RESULT_STATUSES.OK, data, extensions: [] });
  },
  notFoundError(field: 'post' | 'user' | 'comment') {
    return new ResultObject({
      status: RESULT_STATUSES.NOT_FOUND,
      data: null,
      extensions: [{ field, message: `${field} not found` }],
    });
  },
  forbiddenCommentMutation() {
    return new ResultObject({
      status: RESULT_STATUSES.FORBIDDEN,
      data: null,
      extensions: [{ field: null, message: 'Not enough permissions for changing comment' }],
    });
  },
};
