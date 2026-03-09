import { injectable } from 'inversify';
import { QueryFilter } from 'mongoose';

import {
  UserDeviceSessionDocument,
  UserDeviceSessionType,
} from './types/user-device-session.types';
import { UserDeviceSessionModel } from './user-device-session.model';

@injectable()
export class UserDeviceSessionsRepository {
  async getSessionsByUserId(userId: string) {
    return UserDeviceSessionModel.find({ userId }).exec();
  }
  async getSessionByFilter({
    userId,
    deviceId,
    iat,
  }: {
    userId?: string;
    deviceId?: string;
    iat?: Date;
  }) {
    const queryFilter: QueryFilter<UserDeviceSessionType> = {};

    if (userId) {
      queryFilter.userId = userId;
    }

    if (deviceId) {
      queryFilter.deviceId = deviceId;
    }

    if (iat) {
      queryFilter.iat = iat;
    }

    if (Object.keys(queryFilter).length === 0) {
      return null;
    }

    return UserDeviceSessionModel.findOne(queryFilter).exec();
  }

  async deleteSessionByDeviceId(deviceId: string) {
    const { deletedCount } = await UserDeviceSessionModel.deleteOne({ deviceId });

    return deletedCount > 0;
  }

  async deleteSessionsExceptTheCurrent({ deviceId }: { deviceId: string }) {
    const { deletedCount } = await UserDeviceSessionModel.deleteMany({
      deviceId: { $ne: deviceId },
    });

    return deletedCount > 0;
  }

  async saveSession(userDeviceSession: UserDeviceSessionDocument) {
    await userDeviceSession.save();
  }
}
