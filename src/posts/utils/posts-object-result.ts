import { RESULT_STATUSES, ResultObject } from '../../core/utils';

export const postsObjectResult = {
  success<T>(data: T = null as T) {
    return new ResultObject({ status: RESULT_STATUSES.OK, data, extensions: [] });
  },
  notFoundBlog() {
    return new ResultObject({
      status: RESULT_STATUSES.NOT_FOUND,
      data: null,
      extensions: [{ field: null, message: 'Blog not found' }],
    });
  },
  notFoundPost() {
    return new ResultObject({
      status: RESULT_STATUSES.NOT_FOUND,
      data: null,
      extensions: [{ field: null, message: 'Post not found' }],
    });
  },
  badRequest() {
    return new ResultObject({
      status: RESULT_STATUSES.BAD_REQUEST,
      data: null,
      extensions: [{ field: null, message: 'Bad input data' }],
    });
  },
};
