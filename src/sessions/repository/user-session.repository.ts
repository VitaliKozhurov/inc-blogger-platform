import { Filter } from 'mongodb';

import { userSessionCollection } from '../../db';
import { UserSessionDBType } from '../types';

type UpdateSessionArgs = { prevIat: number } & Omit<UserSessionDBType, 'userId' | 'deviceName'>;

export const userSessionRepository = {
  async getUserSessionsByUserId(userId: string) {
    return userSessionCollection.find({ userId }).toArray();
  },
  async getUserSessionByFilter(filter: { userId?: string; deviceId?: string }) {
    const queryFilter: Filter<UserSessionDBType> = {};

    if (filter.userId) {
      queryFilter.userId = filter.userId;
    }

    if (filter.deviceId) {
      queryFilter.deviceId = filter.deviceId;
    }

    if (Object.keys(queryFilter).length === 0) {
      return null;
    }

    return userSessionCollection.findOne(queryFilter);
  },
  async addUserSession(session: UserSessionDBType): Promise<string> {
    const { insertedId } = await userSessionCollection.insertOne(session);

    return insertedId.toString();
  },
  async updateUserSession({ deviceId, prevIat, ...restData }: UpdateSessionArgs): Promise<boolean> {
    const { modifiedCount } = await userSessionCollection.updateOne(
      { deviceId, iat: prevIat },
      { $set: restData }
    );

    return modifiedCount > 0;
  },
  async deleteUserSession({ deviceId }: Pick<UserSessionDBType, 'deviceId'>) {
    const { deletedCount } = await userSessionCollection.deleteOne({ deviceId });

    return deletedCount > 0;
  },
  async deleteUserSessionsExceptTheCurrent({ deviceId }: { deviceId: string }) {
    const { deletedCount } = await userSessionCollection.deleteMany({
      deviceId: { $ne: deviceId },
    });

    return deletedCount > 0;
  },
};
