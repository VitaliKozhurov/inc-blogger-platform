import { HydratedDocument, InferSchemaType, model, Schema, Types } from 'mongoose';

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

export type RequestLogType = InferSchemaType<typeof requestLogSchema> & {
  _id: Types.ObjectId;
};
export type RequestLogDocument = HydratedDocument<RequestLogType>;

export const RequestLogModel = model<RequestLogType>('request-log', requestLogSchema);
