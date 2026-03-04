import { injectable } from 'inversify';
import { ObjectId } from 'mongodb';

import { UserDocument } from './types/user.types';
import { UserModel } from './user.model';

@injectable()
export class UsersRepository {
  async getUserById(id: string) {
    return UserModel.findById(id).exec();
  }

  async getUserByConfirmationCode(code: string) {
    return UserModel.findOne({ 'emailConfirmation.confirmationCode': code });
  }

  async getUserByRecoveryCode(code: string) {
    return UserModel.findOne({ 'passwordRecovery.recoveryCode': code });
  }

  async deleteUserById(id: string) {
    const { deletedCount } = await UserModel.deleteOne({ _id: new ObjectId(id) });

    return deletedCount > 0;
  }

  async saveUser(user: UserDocument) {
    await user.save();
  }
}
