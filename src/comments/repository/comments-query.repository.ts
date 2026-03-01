import { injectable } from 'inversify';

import { Nullable } from '../../core/types';
import { getPaginationData, getPaginationParams } from '../../core/utils';
import { CommentModel, CommentType } from '../model';
import { CommentsRequestQueryType } from '../types';
import { CommentViewModelType } from '../types/comment.view-model';

@injectable()
export class CommentsQueryRepository {
  async getCommentById(id: string): Promise<Nullable<CommentViewModelType>> {
    const comment = await CommentModel.findById(id).lean().exec();

    return comment ? this.mapToViewModel(comment) : comment;
  }

  async getCommentsByPostId({
    postId,
    query,
  }: {
    postId: string;
    query: CommentsRequestQueryType;
  }) {
    const { sort, skip, limit } = getPaginationParams(query);

    const [items, totalCount] = await Promise.all([
      CommentModel.find({ postId }).lean().sort(sort).skip(skip).limit(limit),
      CommentModel.countDocuments({ postId }),
    ]);

    const paginationData = getPaginationData({
      items: items.map(this.mapToViewModel),
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
    });

    return paginationData;
  }

  private mapToViewModel(comment: CommentType): CommentViewModelType {
    return {
      id: comment._id.toString(),
      createdAt: comment.createdAt.toISOString(),
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
    };
  }
}
