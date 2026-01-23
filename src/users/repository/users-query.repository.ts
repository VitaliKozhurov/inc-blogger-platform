import { Filter, ObjectId, WithId } from 'mongodb';

import { RepositoryNotFoundError } from '../../core/errors';
import { ResponseWithPaginationType } from '../../core/types';
import { getPaginationData, getPaginationParams } from '../../core/utils';
import { usersCollection } from '../../db/mongo.db';
import { UserDBType, UsersRequestQueryType, UserViewModelType } from '../types';
import { UserFields } from '../types/user-fields';

export const usersQWRepository = {
  async getUsers(
    args: UsersRequestQueryType
  ): Promise<ResponseWithPaginationType<UserViewModelType>> {
    const { searchLoginTerm, searchEmailTerm, ...restArgs } = args;

    const filter: Filter<UserDBType> = {};

    if (searchLoginTerm) {
      filter[UserFields.LOGIN] = {
        $regex: searchLoginTerm,
        $options: 'i',
      };
    }

    if (searchEmailTerm) {
      filter[UserFields.EMAIL] = {
        $regex: searchEmailTerm,
        $options: 'i',
      };
    }

    const { sort, skip, limit } = getPaginationParams(restArgs);

    const items = await usersCollection.find(filter).sort(sort).skip(skip).limit(limit).toArray();

    const totalCount = await usersCollection.countDocuments(filter);

    const paginationData = getPaginationData({
      totalCount,
      pageNumber: restArgs.pageNumber,
      pageSize: restArgs.pageSize,
      items: items.map(this._mapToViewModel),
    });

    return paginationData;
  },
  async getUserByIdOrFail(id: string): Promise<UserViewModelType> {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      throw new RepositoryNotFoundError('User not exist');
    }

    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  },
  async getUserByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDBType>> {
    const user = await usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    if (!user) {
      throw new RepositoryNotFoundError('User not exist');
    }

    return user;
  },
  _mapToViewModel(user: WithId<UserDBType>): UserViewModelType {
    const { _id, passwordHash: _, ...restUserData } = user;

    return { id: _id.toString(), ...restUserData };
  },
};
