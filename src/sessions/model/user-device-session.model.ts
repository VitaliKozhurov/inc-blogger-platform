import { HydratedDocument, InferSchemaType, model, Schema, Types } from 'mongoose';

const userDeviceSessionSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
    },
    iat: {
      type: Date,
      required: true,
    },
    deviceName: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    expirationAt: {
      type: Date,
      required: true,
    },
  },
  { collection: 'device-sessions', versionKey: false }
);

export type UserDeviceSessionType = InferSchemaType<typeof userDeviceSessionSchema> & {
  _id: Types.ObjectId;
};
export type UserDeviceSessionDocument = HydratedDocument<UserDeviceSessionType>;

export const UserDeviceSessionModel = model<UserDeviceSessionType>(
  'device-session',
  userDeviceSessionSchema
);
