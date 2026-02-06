import { HTTP_STATUSES } from '../types';

export type ExtensionType = {
  field: string | null;
  message: string;
};

export enum RESULT_STATUSES {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

export type ResultType<T = null> = {
  status: RESULT_STATUSES;
  errorMessage?: string;
  extensions: ExtensionType[];
  data: T;
};

export class ResultObject<T> {
  status: RESULT_STATUSES;
  data: T;
  extensions: ExtensionType[];
  errorMessage?: string;

  constructor(args: {
    status: RESULT_STATUSES;
    data: T;
    extensions: ExtensionType[];
    errorMessage?: string;
  }) {
    this.status = args.status;
    this.data = args.data;
    this.extensions = args.extensions;
    this.errorMessage = args.errorMessage;
  }
}

export const resultCodeToHttpException = (resultCode: RESULT_STATUSES): number => {
  switch (resultCode) {
    case RESULT_STATUSES.BAD_REQUEST:
      return HTTP_STATUSES.BAD_REQUEST;
    case RESULT_STATUSES.UNAUTHORIZED:
      return HTTP_STATUSES.UNAUTHORIZED;
    case RESULT_STATUSES.FORBIDDEN:
      return HTTP_STATUSES.FORBIDDEN;
    case RESULT_STATUSES.NOT_FOUND:
      return HTTP_STATUSES.NOT_FOUND;
    default:
      return HTTP_STATUSES.INTERNAL_SERVER_ERROR;
  }
};
