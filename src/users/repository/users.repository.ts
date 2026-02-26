import { injectable } from 'inversify';
import { ObjectId, WithId } from 'mongodb';

import { Nullable } from '../../core/types';
import { usersCollection } from '../../db/mongo.db';
import { UserDBType } from '../types';

@injectable()
export class UsersRepository {
  async createUser(userData: UserDBType) {
    const { insertedId } = await usersCollection.insertOne(userData);

    return insertedId.toString();
  }

  async deleteUserById(id: string) {
    const { deletedCount } = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    return deletedCount > 0;
  }

  async updateUserById({ id, userData }: { id: string; userData: UserDBType }) {
    const { modifiedCount } = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: userData }
    );

    return modifiedCount > 0;
  }

  async updateUserPasswordByUserId({ id, passwordHash }: { id: string; passwordHash: string }) {
    const { modifiedCount } = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { passwordHash }, $unset: { passwordRecovery: '' } }
    );

    return modifiedCount > 0;
  }

  async getUserByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDBType> | null> {
    const user = await usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    return user;
  }

  async getUserByConfirmationCode(code: string): Promise<WithId<UserDBType> | null> {
    const user = await usersCollection.findOne({ 'emailConfirmation.confirmationCode': code });

    return user;
  }

  async getUserByRecoveryCode(code: string): Promise<WithId<UserDBType> | null> {
    const user = await usersCollection.findOne({ 'passwordRecovery.recoveryCode': code });

    return user;
  }

  async getUserById(id: string): Promise<Nullable<WithId<UserDBType>>> {
    return usersCollection.findOne({ _id: new ObjectId(id) });
  }
}
