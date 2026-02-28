import { injectable } from 'inversify';
import { ObjectId } from 'mongodb';

import { CommentDocument, CommentModel, CommentType } from '../model';

@injectable()
export class CommentsRepository {
  async getCommentById(id: string) {
    return CommentModel.findById(id);
  }

  async createComment(comment: Omit<CommentType, '_id'>) {
    const { id } = await CommentModel.create(comment);

    return id;
  }

  async deleteCommentById(id: string) {
    const { deletedCount } = await CommentModel.deleteOne({ _id: new ObjectId(id) });

    return deletedCount > 0;
  }

  async saveComment(commentDocument: CommentDocument) {
    await commentDocument.save();
  }
}
