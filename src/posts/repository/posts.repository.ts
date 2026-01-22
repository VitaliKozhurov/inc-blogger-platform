import { ObjectId } from 'mongodb';

import { RepositoryNotFoundError } from '../../core/errors';
import { postCollection } from '../../db';
import { PostDBType, UpdatePostInputType } from '../types';

export const postsRepository = {
  createPost: async (post: PostDBType): Promise<string> => {
    const { insertedId } = await postCollection.insertOne(post);

    return insertedId.toString();
  },

  updatePostById: async (args: { id: string; postData: UpdatePostInputType }): Promise<void> => {
    const { id, postData } = args;

    const { modifiedCount } = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: postData }
    );

    if (modifiedCount < 1) {
      throw new RepositoryNotFoundError('Post not exist');
    }

    return;
  },

  deletePostById: async (id: string): Promise<void> => {
    const { deletedCount } = await postCollection.deleteOne({ _id: new ObjectId(id) });

    if (deletedCount < 1) {
      throw new RepositoryNotFoundError('Post not exist');
    }

    return;
  },
};
