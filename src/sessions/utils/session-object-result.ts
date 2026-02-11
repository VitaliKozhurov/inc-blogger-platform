import { RESULT_STATUSES, ResultObject } from '../../core/utils';

export const sessionObjectResult = {
  success<T>(data: T | null = null) {
    return new ResultObject({ status: RESULT_STATUSES.OK, data, extensions: [] });
  },
  notFound() {
    return new ResultObject({
      status: RESULT_STATUSES.NOT_FOUND,
      data: null,
      extensions: [{ field: 'deviceId', message: 'Not found sessions with the same device id' }],
    });
  },
  forbidden() {
    return new ResultObject({
      status: RESULT_STATUSES.FORBIDDEN,
      data: null,
      extensions: [{ field: 'deviceId', message: 'Device id does not belong to the user' }],
    });
  },
};
