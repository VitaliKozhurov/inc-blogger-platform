import { ObjectId } from 'mongodb';

import { postsCollection } from '../../db';
import { PostDBType, UpdatePostInputType } from '../types';

export const postsRepository = {
  createPost: async (post: PostDBType): Promise<string> => {
    const { insertedId } = await postsCollection.insertOne(post);

    return insertedId.toString();
  },

  updatePostById: async (args: { id: string; postData: UpdatePostInputType }): Promise<boolean> => {
    const { id, postData } = args;

    const { modifiedCount } = await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: postData }
    );

    return modifiedCount > 0;
  },

  deletePostById: async (id: string): Promise<boolean> => {
    const { deletedCount } = await postsCollection.deleteOne({ _id: new ObjectId(id) });

    return deletedCount > 0;
  },
};
