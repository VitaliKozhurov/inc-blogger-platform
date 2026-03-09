import { model, Schema } from 'mongoose';

import { RequestLogType } from './types/request-log.types';

const requestLogSchema = new Schema(
  {
    ip: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { collection: 'request-logs' }
);

export const RequestLogModel = model<RequestLogType>('request-log', requestLogSchema);
