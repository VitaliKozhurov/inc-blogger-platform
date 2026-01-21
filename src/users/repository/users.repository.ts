import { ObjectId } from 'mongodb';

import { RepositoryNotFoundError } from '../../core/errors';
import { userCollection } from '../../db/mongo.db';
import { UserDBType } from '../types';

export const usersRepository = {
  createUser: async (userData: UserDBType) => {
    const { insertedId } = await userCollection.insertOne(userData);

    return insertedId.toString();
  },
  deleteUserById: async (id: string) => {
    const { deletedCount } = await userCollection.deleteOne({ _id: new ObjectId(id) });

    if (deletedCount < 1) {
      throw new RepositoryNotFoundError('Blog not exist');
    }

    return;
  },
};
