import { injectable } from 'inversify';

import { Nullable, ResponseWithPaginationType } from '../../core/types';
import { getPaginationData, getPaginationParams } from '../../core/utils';
import { UserModel, UserType } from '../model';
import { MeUserViewModelType, UsersRequestQueryType, UserViewModelType } from '../types';
import { UserFields } from '../types/user-fields';

type UserMapInputType = Pick<UserType, '_id' | 'login' | 'email' | 'createdAt'>;

@injectable()
export class UsersQueryRepository {
  async getUsers(
    args: UsersRequestQueryType
  ): Promise<ResponseWithPaginationType<UserViewModelType>> {
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
      UserModel.find(filter)
        .select('_id login email createdAt')
        .lean<UserMapInputType[]>()
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
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

  async getUserById(id: string): Promise<Nullable<UserViewModelType>> {
    const user = await UserModel.findById(id)
      .select('_id login email createdAt')
      .lean<UserMapInputType>()
      .exec();

    if (!user) {
      return null;
    }

    return this.mapToViewModel(user);
  }

  async getMeUserById(id: string): Promise<Nullable<MeUserViewModelType>> {
    const user = await UserModel.findById(id)
      .select('_id login email createdAt')
      .lean<UserMapInputType>()
      .exec();

    if (!user) {
      return null;
    }

    return { userId: user._id.toString(), email: user.email, login: user.login };
  }

  private mapToViewModel(user: UserMapInputType): UserViewModelType {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
