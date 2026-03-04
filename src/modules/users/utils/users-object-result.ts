import { RESULT_STATUSES, ResultObject } from '../../core/utils';

export const usersObjectResult = {
  success<T>(data: T = null as T) {
    return new ResultObject({ status: RESULT_STATUSES.OK, data, extensions: [] });
  },
  notFoundUser() {
    return new ResultObject({
      status: RESULT_STATUSES.NOT_FOUND,
      data: null,
      extensions: [{ field: null, message: 'User not found' }],
    });
  },
  invalidCredentials(field: 'login' | 'email') {
    return new ResultObject({
      status: RESULT_STATUSES.BAD_REQUEST,
      data: null,
      extensions: [{ field, message: 'User with such credentials exist in the system' }],
    });
  },
};
