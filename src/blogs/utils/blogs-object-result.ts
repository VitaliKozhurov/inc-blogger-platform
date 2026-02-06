import { RESULT_STATUSES, ResultObject } from '../../core/utils';

export const blogsObjectResult = {
  success<T>(data: T = null as T) {
    return new ResultObject({ status: RESULT_STATUSES.OK, data, extensions: [] });
  },
  notFoundBlog() {
    return new ResultObject({ status: RESULT_STATUSES.NOT_FOUND, data: null, extensions: [] });
  },
};
