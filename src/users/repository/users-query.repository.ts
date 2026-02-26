import { injectable } from 'inversify';
import { Filter, ObjectId, WithId } from 'mongodb';

import { Nullable, ResponseWithPaginationType } from '../../core/types';
import { getPaginationData, getPaginationParams } from '../../core/utils';
import { usersCollection } from '../../db/mongo.db';
import {
  MeUserViewModelType,
  UserDBType,
  UsersRequestQueryType,
  UserViewModelType,
} from '../types';
import { UserFields } from '../types/user-fields';

@injectable()
export class UsersQueryRepository {
  async getUsers(
    args: UsersRequestQueryType
  ): Promise<ResponseWithPaginationType<UserViewModelType>> {
    const { searchLoginTerm, searchEmailTerm, ...restArgs } = args;

    const filter: Filter<UserDBType> = {};

    const searchFilter: Filter<UserDBType>[] = [];

    if (searchLoginTerm) {
      searchFilter.push({
        [UserFields.LOGIN]: {
          $regex: searchLoginTerm,
          $options: 'i',
        },
      });
    }

    if (searchEmailTerm) {
      searchFilter.push({
        [UserFields.EMAIL]: {
          $regex: searchEmailTerm,
          $options: 'i',
        },
      });
    }

    if (searchFilter.length > 0) {
      filter.$or = searchFilter;
    }

    const { sort, skip, limit } = getPaginationParams(restArgs);

    const items = await usersCollection.find(filter).sort(sort).skip(skip).limit(limit).toArray();

    const totalCount = await usersCollection.countDocuments(filter);

    const paginationData = getPaginationData({
      totalCount,
      pageNumber: restArgs.pageNumber,
      pageSize: restArgs.pageSize,
      items: items.map(this.mapToViewModel),
    });

    return paginationData;
  }
  async getUserById(id: string): Promise<Nullable<UserViewModelType>> {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return null;
    }

    return this.mapToViewModel(user);
  }
  async getMeUserById(id: string): Promise<Nullable<MeUserViewModelType>> {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return null;
    }

    return { userId: user._id.toString(), email: user.email, login: user.login };
  }
  private mapToViewModel(user: WithId<UserDBType>): UserViewModelType {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
