import { injectable } from 'inversify';

import { Nullable } from '../../core/types';
import { getPaginationData, getPaginationParams } from '../../core/utils';
import { LikeModel, LikeStatus } from '../../likes/model';
import { CommentModel, CommentType } from '../model';
import { CommentsRequestQueryType } from '../types';
import { CommentViewModelType } from '../types/comment.view-model';

@injectable()
export class CommentsQueryRepository {
  async getCommentById({
    commentId,
    userId,
  }: {
    commentId: string;
    userId?: string;
  }): Promise<Nullable<CommentViewModelType>> {
    const comment = await CommentModel.findById(commentId).lean().exec();

    if (!comment) {
      return null;
    }

    const parentId = comment._id.toString();

    const like = userId
      ? await LikeModel.findOne({ parentId, authorId: userId }).select('status').lean().exec()
      : null;

    return this.mapToViewModel({ comment, myStatus: like?.status ?? LikeStatus.None });
  }

  async getCommentsByPostId({
    userId,
    postId,
    query,
  }: {
    userId?: string;
    postId: string;
    query: CommentsRequestQueryType;
  }) {
    const { sort, skip, limit } = getPaginationParams(query);

    const [items, totalCount] = await Promise.all([
      CommentModel.find({ postId }).lean().sort(sort).skip(skip).limit(limit),
      CommentModel.countDocuments({ postId }),
    ]);

    const commentsIds = items.map(c => c._id.toString());

    const likes = await LikeModel.find({ parentId: { $in: commentsIds } })
      .lean()
      .exec();

    const paginationData = getPaginationData({
      items: items.map(comment => {
        const like = likes.find(
          like => like.parentId === comment._id.toString() && like.authorId === userId
        );

        return this.mapToViewModel({
          comment,
          myStatus: like && like.authorId === userId ? like.status : LikeStatus.None,
        });
      }),
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
    });

    return paginationData;
  }

  private mapToViewModel({
    comment,
    myStatus,
  }: {
    comment: CommentType;
    myStatus: LikeStatus;
  }): CommentViewModelType {
    return {
      id: comment._id.toString(),
      createdAt: comment.createdAt.toISOString(),
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus,
      },
    };
  }
}
