import { HydratedDocument } from 'mongoose';

import { CreateUserDeviceSessionType } from '../dto/create-user-device-session.dto';
import { UpdateUserDeviceSessionDTO } from '../dto/update-user-device-session.dto';

export type UserDeviceSessionType = {
  userId: string;
  deviceId: string;
  deviceName: string;
  ip: string;
  iat: Date;
  expirationAt: Date;
};

export type UserDeviceSessionDocument = HydratedDocument<
  UserDeviceSessionType,
  UserDeviceSessionMethodsType
>;

export type UserDeviceSessionStaticMethodsType = {
  createUserDevicesSessionInstance(
    args: CreateUserDeviceSessionType
  ): Promise<UserDeviceSessionDocument>;
};

export type UserDeviceSessionMethodsType = {
  checkIsForeignSession(userId: string): boolean;
  updateUserDeviceSession(args: UpdateUserDeviceSessionDTO): UserDeviceSessionDocument;
};
