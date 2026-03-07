import { RESULT_STATUSES, ResultObject } from '../../../core/utils';

export const authObjectResult = {
  success<T>(data: T | null = null) {
    return new ResultObject({ status: RESULT_STATUSES.OK, data, extensions: [] });
  },
  invalidCredentials() {
    return new ResultObject({
      status: RESULT_STATUSES.UNAUTHORIZED,
      data: null,
      extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
    });
  },
  invalidRefreshToken() {
    return new ResultObject({
      status: RESULT_STATUSES.UNAUTHORIZED,
      data: null,
      extensions: [{ field: 'refreshToken', message: 'Wrong refresh token' }],
    });
  },
  emailNotVerified() {
    return new ResultObject({
      status: RESULT_STATUSES.UNAUTHORIZED,
      data: null,
      extensions: [{ field: null, message: 'Account should be confirmed from email address' }],
    });
  },
  registrationInvalidCredentials(field: 'email' | 'login') {
    return new ResultObject({
      status: RESULT_STATUSES.BAD_REQUEST,
      data: null,
      extensions: [{ field, message: 'User with such credentials is Exist' }],
    });
  },
  invalidConfirmationCode() {
    return new ResultObject({
      status: RESULT_STATUSES.BAD_REQUEST,
      data: null,
      extensions: [{ field: 'code', message: 'Incorrect confirmation code' }],
    });
  },
  invalidRecoveryCode() {
    return new ResultObject({
      status: RESULT_STATUSES.BAD_REQUEST,
      data: null,
      extensions: [{ field: 'recoveryCode', message: 'Incorrect recovery code' }],
    });
  },
  notFoundSession() {
    return new ResultObject({
      status: RESULT_STATUSES.NOT_FOUND,
      data: null,
      extensions: [{ field: 'deviceId', message: 'Not found sessions with the same device id' }],
    });
  },
};
