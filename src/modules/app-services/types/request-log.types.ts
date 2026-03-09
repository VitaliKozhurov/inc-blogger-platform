import { HydratedDocument } from 'mongoose';

export type RequestLogType = {
  ip: string;
  url: string;
  date: Date;
};

export type RequestLogDocument = HydratedDocument<RequestLogType>;
