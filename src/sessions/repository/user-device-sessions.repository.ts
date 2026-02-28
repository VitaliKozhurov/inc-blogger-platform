import { injectable } from 'inversify';
import { QueryFilter } from 'mongoose';

import { UserDeviceSessionDocument, UserDeviceSessionModel, UserDeviceSessionType } from '../model';

@injectable()
export class UserDeviceSessionsRepository {
  async getUserDeviceSessionsByUserId(userId: string) {
    return UserDeviceSessionModel.find({ userId }).exec();
  }
  async getUserDeviceSessionByFilter({ userId, deviceId }: { userId?: string; deviceId?: string }) {
    const queryFilter: QueryFilter<UserDeviceSessionType> = {};

    if (userId) {
      queryFilter.userId = userId;
    }

    if (deviceId) {
      queryFilter.deviceId = deviceId;
    }

    if (Object.keys(queryFilter).length === 0) {
      return null;
    }

    return UserDeviceSessionModel.findOne(queryFilter).exec();
  }

  async createUserDeviceSession(session: Omit<UserDeviceSessionType, '_id'>): Promise<string> {
    const { id } = await UserDeviceSessionModel.create(session);

    return id;
  }

  async deleteUserDeviceSession(deviceId: string) {
    const { deletedCount } = await UserDeviceSessionModel.deleteOne({ deviceId });

    return deletedCount > 0;
  }

  async deleteUserDeviceSessionsExceptTheCurrent({ deviceId }: { deviceId: string }) {
    const { deletedCount } = await UserDeviceSessionModel.deleteMany({
      deviceId: { $ne: deviceId },
    });

    return deletedCount > 0;
  }

  async saveUserDeviceSession(userDeviceSession: UserDeviceSessionDocument) {
    await userDeviceSession.save();
  }
}
