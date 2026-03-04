import { injectable } from 'inversify';
import { ObjectId } from 'mongodb';

import { Nullable } from '../../core/types';
import { UserDocument, UserModel, UserType } from '../model';

@injectable()
export class UsersRepository {
  async getUserById(id: string): Promise<Nullable<UserDocument>> {
    return UserModel.findById(id).exec();
  }

  async getUserByLoginOrEmail(loginOrEmail: string): Promise<Nullable<UserDocument>> {
    return UserModel.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] }).exec();
  }

  async getUserByConfirmationCode(code: string): Promise<Nullable<UserDocument>> {
    return UserModel.findOne({ 'emailConfirmation.confirmationCode': code });
  }

  async getUserByRecoveryCode(code: string): Promise<Nullable<UserDocument>> {
    return UserModel.findOne({ 'passwordRecovery.recoveryCode': code });
  }

  async createUser(userData: Omit<UserType, '_id'>) {
    const { id } = await UserModel.create(userData);

    return id;
  }

  async deleteUserById(id: string) {
    const { deletedCount } = await UserModel.deleteOne({ _id: new ObjectId(id) });

    return deletedCount > 0;
  }

  async saveUser(user: UserDocument) {
    await user.save();
  }
}
