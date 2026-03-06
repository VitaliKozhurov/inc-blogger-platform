import { injectable } from 'inversify';
import { Types } from 'mongoose';

import { getPaginationData, getPaginationParams } from '../../core/utils';
import { LikeModel, LikeStatus } from '../../likes/model';

import { CommentModel } from './comment.model';
import { CommentsRequestQueryDTO } from './dto/comment-request-type.dto';
import { CommentViewModelDTO } from './dto/comment-view-model.dto';
import { CommentType } from './types/comment.types';

type CommentMapInputType = { _id: Types.ObjectId } & CommentType;

@injectable()
export class CommentsQueryRepository {
  async getCommentById({ commentId, userId }: { commentId: string; userId?: string }) {
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
    query: CommentsRequestQueryDTO;
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
    comment: CommentMapInputType;
    myStatus: LikeStatus;
  }): CommentViewModelDTO {
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
