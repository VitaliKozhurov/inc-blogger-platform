import { injectable } from 'inversify';
import { ObjectId } from 'mongodb';

import { CommentModel } from './comment.model';
import { CommentDocument } from './types/comment.types';

@injectable()
export class CommentsRepository {
  async getCommentById(id: string) {
    return CommentModel.findById(id);
  }

  async deleteCommentById(id: string) {
    const { deletedCount } = await CommentModel.deleteOne({ _id: new ObjectId(id) });

    return deletedCount > 0;
  }

  async saveComment(commentDocument: CommentDocument) {
    await commentDocument.save();
  }
}
