import { injectable } from 'inversify';
import { Types } from 'mongoose';

import { Nullable, ResponseWithPaginationType } from '../../core/types';
import { getPaginationData, getPaginationParams } from '../../core/utils';

import { MeUserViewModelDTO } from './dto/me-user-view-model.dto';
import { UserViewModelDTO } from './dto/user-view-model.dto';
import { UsersRequestQueryDTO } from './dto/users-request-query.dto';
import { UserFields } from './types/user-fields.types';
import { UserType } from './types/user.types';
import { UserModel } from './user.model';

type UserMapInputType = { _id: Types.ObjectId } & UserType;

@injectable()
export class UsersQueryRepository {
  async getUsers(
    args: UsersRequestQueryDTO
  ): Promise<ResponseWithPaginationType<UserViewModelDTO>> {
    const { searchLoginTerm, searchEmailTerm, ...restArgs } = args;

    const searchFilter = [];

    if (searchLoginTerm) {
      searchFilter.push({ [UserFields.LOGIN]: { $regex: searchLoginTerm, $options: 'i' } });
    }

    if (searchEmailTerm) {
      searchFilter.push({ [UserFields.EMAIL]: { $regex: searchEmailTerm, $options: 'i' } });
    }

    const filter = searchFilter.length ? { $or: searchFilter } : {};

    const { sort, skip, limit } = getPaginationParams(restArgs);

    const [items, totalCount] = await Promise.all([
      UserModel.find(filter).lean<UserMapInputType[]>().sort(sort).skip(skip).limit(limit).exec(),
      UserModel.countDocuments(filter).exec(),
    ]);

    const paginationData = getPaginationData({
      totalCount,
      pageNumber: restArgs.pageNumber,
      pageSize: restArgs.pageSize,
      items: items.map(this.mapToViewModel),
    });

    return paginationData;
  }

  async getUserById(id: string): Promise<Nullable<UserViewModelDTO>> {
    const user = await UserModel.findById(id).lean().exec();

    if (!user) {
      return null;
    }

    return this.mapToViewModel(user);
  }

  async getMeUserById(id: string): Promise<Nullable<MeUserViewModelDTO>> {
    const user = await UserModel.findById(id).lean().exec();

    if (!user) {
      return null;
    }

    return { userId: user._id.toString(), email: user.email, login: user.login };
  }

  private mapToViewModel(user: UserMapInputType): UserViewModelDTO {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
