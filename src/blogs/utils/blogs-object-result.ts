import { RESULT_STATUSES, ResultObject } from '../../core/utils';

export const blogsObjectResult = {
  success<T>(data?: T) {
    return new ResultObject({ status: RESULT_STATUSES.OK, data: data, extensions: [] });
  },
  notFoundBlog() {
    return new ResultObject({ status: RESULT_STATUSES.NOT_FOUND, data: null, extensions: [] });
  },
};
