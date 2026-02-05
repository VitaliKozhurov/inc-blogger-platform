import { ObjectId, WithId } from 'mongodb';

import { Nullable } from '../../core/types';
import { commentsCollection } from '../../db/mongo.db';
import { CommentDbType } from '../types';

export const commentsRepository = {
  async createComment(comment: CommentDbType) {
    const { insertedId } = await commentsCollection.insertOne(comment);

    return insertedId.toString();
  },
  async updateCommentById({ id, content }: { id: string; content: string }) {
    const { modifiedCount } = await commentsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { content } }
    );

    return modifiedCount > 0;
  },
  async deleteCommentById(id: string) {
    const { deletedCount } = await commentsCollection.deleteOne({ _id: new ObjectId(id) });

    return deletedCount > 0;
  },
  async getCommentById(id: string): Promise<Nullable<WithId<CommentDbType>>> {
    return commentsCollection.findOne({ _id: new ObjectId(id) });
  },
};
