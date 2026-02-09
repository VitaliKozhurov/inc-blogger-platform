import { userSessionCollection } from '../../db';
import { UserSessionDBType } from '../types';

export const userSessionRepository = {
  async addUserSession(session: UserSessionDBType): Promise<string> {
    const { insertedId } = await userSessionCollection.insertOne(session);

    return insertedId.toString();
  },
};
