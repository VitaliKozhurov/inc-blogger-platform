import { injectable } from 'inversify';
import { ObjectId } from 'mongodb';

import { postsCollection } from '../../db';
import { PostDBType, UpdatePostInputType } from '../types';

@injectable()
export class PostsRepository {
  async createPost(post: PostDBType) {
    const { insertedId } = await postsCollection.insertOne(post);

    return insertedId.toString();
  }

  async updatePostById(args: { id: string; postData: UpdatePostInputType }) {
    const { id, postData } = args;

    const { modifiedCount } = await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: postData }
    );

    return modifiedCount > 0;
  }

  async deletePostById(id: string) {
    const { deletedCount } = await postsCollection.deleteOne({ _id: new ObjectId(id) });

    return deletedCount > 0;
  }

  async getPostById(id: string) {
    return postsCollection.findOne({ _id: new ObjectId(id) });
  }
}
