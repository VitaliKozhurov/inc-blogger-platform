import { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

const deviceSessionSchema = new Schema(
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
      type: Number,
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
      type: Number,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
  },
  { collection: 'device-sessions' }
);

export type DeviceSessionType = InferSchemaType<typeof deviceSessionSchema>;
export type DeviceSessionDocument = HydratedDocument<DeviceSessionType>;

export const DeviceSessionModel = model<DeviceSessionType>('device-session', deviceSessionSchema);
