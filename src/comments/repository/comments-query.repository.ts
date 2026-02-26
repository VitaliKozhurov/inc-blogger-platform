import { injectable } from 'inversify';
import { ObjectId, WithId } from 'mongodb';

import { Nullable } from '../../core/types';
import { getPaginationData, getPaginationParams } from '../../core/utils';
import { commentsCollection } from '../../db/mongo.db';
import { CommentDbType, CommentsRequestQueryType } from '../types';
import { CommentViewModelType } from '../types/comment.view-model';

@injectable()
export class CommentsQueryRepository {
  async getCommentsByPostId({
    postId,
    query,
  }: {
    postId: string;
    query: CommentsRequestQueryType;
  }) {
    const { sort, skip, limit } = getPaginationParams(query);

    const items = await commentsCollection
      .find({ postId })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
    const totalCount = await commentsCollection.countDocuments({ postId });

    const paginationData = getPaginationData({
      items: items.map(this.mapToViewModel),
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
    });

    return paginationData;
  }

  async getCommentById(id: string): Promise<Nullable<CommentViewModelType>> {
    const comment = await commentsCollection.findOne({ _id: new ObjectId(id) });

    return comment ? this.mapToViewModel(comment) : comment;
  }

  private mapToViewModel({ _id, postId: _, ...restComment }: WithId<CommentDbType>) {
    return { id: _id.toString(), ...restComment };
  }
}
