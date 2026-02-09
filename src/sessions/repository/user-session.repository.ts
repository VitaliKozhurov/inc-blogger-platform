import { userSessionCollection } from '../../db';
import { UserSessionDBType } from '../types';

type UpdateSessionArgs = { prevIat: number } & Omit<UserSessionDBType, 'userId' | 'deviceName'>;

export const userSessionRepository = {
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
  async deleteUserSession({ deviceId, iat }: Pick<UserSessionDBType, 'deviceId' | 'iat'>) {
    const { deletedCount } = await userSessionCollection.deleteOne({ deviceId, iat });

    return deletedCount > 0;
  },
  async deleteUserSessionsExceptTheCurrent({ deviceId }: { deviceId: string }) {
    const { deletedCount } = await userSessionCollection.deleteMany({
      deviceId: { $ne: deviceId },
    });

    return deletedCount > 0;
  },
  async getUserSessionByUserId(userId: string) {
    return userSessionCollection.find({ userId }).toArray();
  },
};
