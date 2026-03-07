import { Model, model, Schema } from 'mongoose';

import { CreateUserDeviceSessionType } from './dto/create-user-device-session.dto';
import { UpdateUserDeviceSessionDTO } from './dto/update-user-device-session.dto';
import {
  UserDeviceSessionMethodsType,
  UserDeviceSessionStaticMethodsType,
  UserDeviceSessionType,
} from './types/user-device-session.types';

type UserDeviceSessionModelType = Model<
  UserDeviceSessionType,
  unknown,
  UserDeviceSessionMethodsType
> &
  UserDeviceSessionStaticMethodsType;

const userDeviceSessionSchema = new Schema<
  UserDeviceSessionType,
  UserDeviceSessionModelType,
  UserDeviceSessionMethodsType
>(
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

userDeviceSessionSchema.method(
  'checkIsForeignSession',
  function checkIsForeignSession(userId: string) {
    return this.userId !== userId;
  }
);

userDeviceSessionSchema.method(
  'updateUserDeviceSession',
  function updateUserDeviceSession(args: UpdateUserDeviceSessionDTO) {
    this.ip = args.ip;
    this.iat = args.iat;
    this.expirationAt = args.expirationAt;

    return this;
  }
);

userDeviceSessionSchema.static(
  'createBlogInstance',
  async function createBlogInstance(
    args: CreateUserDeviceSessionType
  ): ReturnType<UserDeviceSessionStaticMethodsType['createUserDevicesSessionInstance']> {
    const newUserDeviceSession = {
      userId: args.userId,
      deviceId: args.deviceId,
      deviceName: args.deviceName,
      ip: args.ip,
      iat: args.iat,
      expirationAt: args.expirationAt,
    };

    const userDeviceSessionDocument = await this.create(newUserDeviceSession);

    return userDeviceSessionDocument;
  }
);

export const UserDeviceSessionModel = model<UserDeviceSessionType, UserDeviceSessionModelType>(
  'device-session',
  userDeviceSessionSchema
);
