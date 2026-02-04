import { HTTP_STATUSES } from './http-statuses';

type ExtensionType = {
  field: string | null;
  message: string;
};

export enum RESULT_STATUSES {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  SERVER_ERROR,
}

export type ResultType<T = null> = {
  status: HTTP_STATUSES;
  errorMessage?: string;
  extensions: ExtensionType[];
  data: T;
};
