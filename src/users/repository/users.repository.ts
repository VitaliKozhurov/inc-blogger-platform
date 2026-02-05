import { ObjectId, WithId } from 'mongodb';

import { usersCollection } from '../../db/mongo.db';
import { UserDBType } from '../types';

export const usersRepository = {
  async createUser(userData: UserDBType) {
    const { insertedId } = await usersCollection.insertOne(userData);

    return insertedId.toString();
  },
  async deleteUserById(id: string) {
    const { deletedCount } = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    return deletedCount > 0;
  },
  async updateUserById({ id, userData }: { id: string; userData: UserDBType }) {
    const { modifiedCount } = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: userData }
    );

    return modifiedCount > 0;
  },
  async getUserByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDBType> | null> {
    const user = await usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    return user;
  },
  async getUserByConfirmationCode(code: string): Promise<WithId<UserDBType> | null> {
    const user = await usersCollection.findOne({ 'emailConfirmation.confirmationCode': code });

    return user;
  },
};
