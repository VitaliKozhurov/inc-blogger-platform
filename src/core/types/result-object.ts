import { HTTP_STATUSES } from './http-statuses';

type ExtensionType = {
  field: string | null;
  message: string;
};

export type ResultType<T = null> = {
  status: HTTP_STATUSES;
  errorMessage?: string;
  extensions: ExtensionType[];
  data: T;
};
