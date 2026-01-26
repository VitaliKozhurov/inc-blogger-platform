import { ObjectId } from 'mongodb';

import { usersCollection } from '../../db/mongo.db';
import { UserDBType } from '../types';

export const usersRepository = {
  createUser: async (userData: UserDBType) => {
    const { insertedId } = await usersCollection.insertOne(userData);

    return insertedId.toString();
  },
  deleteUserById: async (id: string) => {
    const { deletedCount } = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    return deletedCount > 0;
  },
};
