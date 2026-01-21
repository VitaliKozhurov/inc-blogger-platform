import { Filter, ObjectId, WithId } from 'mongodb';

import { RepositoryNotFoundError } from '../../core/errors';
import { getPaginationParams } from '../../core/utils';
import { userCollection } from '../../db/mongo.db';
import { UserEntityType, UserRequestQueryType } from '../types';
import { UserFields } from '../types/user-fields';

export const usersQWRepository = {
  getUsers: async (
    args: UserRequestQueryType
  ): Promise<{ items: WithId<UserEntityType>[]; totalCount: number }> => {
    const { searchLoginTerm, searchEmailTerm, ...restArgs } = args;

    const filter: Filter<UserEntityType> = {};

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

    const items = await userCollection.find(filter).sort(sort).skip(skip).limit(limit).toArray();
    const totalCount = await userCollection.countDocuments(filter);

    return { items, totalCount };
  },
  getUserByIdOrFail: async (id: string): Promise<WithId<UserEntityType>> => {
    const user = await userCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      throw new RepositoryNotFoundError('Blog not exist');
    }

    return user;
  },
};
