import { Model, model, Schema } from 'mongoose';

import { LikeStatus } from '../likes/types/like-status.types';
import { LikeDocument } from '../likes/types/like.types';

import { CreateCommentDTO } from './dto/create-comment.dto';
import { UpdateCommentDTO } from './dto/update-comment.dto';
import { CommentMethodsType, CommentStaticMethodsType, CommentType } from './types/comment.types';

type CommentModelType = Model<CommentType, unknown, CommentMethodsType> & CommentStaticMethodsType;

const commentLikeSchema = new Schema(
  {
    likesCount: {
      type: Number,
      default: 0,
    },
    dislikesCount: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const commentatorInfoSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userLogin: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const commentSchema = new Schema<CommentType, CommentModelType, CommentMethodsType>(
  {
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    commentatorInfo: {
      type: commentatorInfoSchema,
      required: true,
    },
    likesInfo: {
      type: commentLikeSchema,
      required: true,
    },
  },
  { collection: 'comments', versionKey: false }
);

commentSchema.method('isCommentOwner', function isCommentOwner(userId: string) {
  return this.commentatorInfo.userId === userId;
});
commentSchema.method('updateComment', function updateComment(args: UpdateCommentDTO) {
  this.content = args.content;

  return this;
});
commentSchema.method(
  'updateCommentLikesByIncomingLikeStatusAndLike',
  function updateCommentLikesByIncomingLikeStatusAndLike(args: {
    like: LikeDocument;
    likeStatus: LikeStatus;
  }) {
    const { like, likeStatus } = args;

    if (like.status === LikeStatus.Like) {
      if (likeStatus === LikeStatus.Dislike) {
        this.likesInfo.dislikesCount += 1;
        this.likesInfo.likesCount -= 1;
      }

      if (likeStatus === LikeStatus.None) {
        this.likesInfo.likesCount -= 1;
      }
    }

    if (like.status === LikeStatus.Dislike) {
      if (likeStatus === LikeStatus.Like) {
        this.likesInfo.likesCount += 1;
        this.likesInfo.dislikesCount -= 1;
      }

      if (likeStatus === LikeStatus.None) {
        this.likesInfo.dislikesCount -= 1;
      }
    }

    if (like.status === LikeStatus.None) {
      if (likeStatus === LikeStatus.Like) {
        this.likesInfo.likesCount += 1;
      }

      if (likeStatus === LikeStatus.Dislike) {
        this.likesInfo.dislikesCount += 1;
      }
    }

    this.likesInfo.likesCount = Math.max(0, this.likesInfo.likesCount);
    this.likesInfo.dislikesCount = Math.max(0, this.likesInfo.dislikesCount);

    return this;
  }
);

commentSchema.method(
  'updateCommentLikesByIncomingLikeStatus',
  function updateCommentLikesByIncomingLikeStatus(likeStatus: LikeStatus) {
    if (likeStatus === LikeStatus.Like) {
      this.likesInfo.likesCount += 1;
    }

    if (likeStatus === LikeStatus.Dislike) {
      this.likesInfo.dislikesCount += 1;
    }

    return this;
  }
);

commentSchema.static(
  'createCommentInstance',
  async function createCommentInstance(args: {
    postId: string;
    commentData: CreateCommentDTO;
    userData: { userId: string; userLogin: string };
  }): ReturnType<CommentStaticMethodsType['createCommentInstance']> {
    const { postId, commentData, userData } = args;

    const newComment = {
      content: commentData.content,
      createdAt: new Date(),
      postId,
      commentatorInfo: { userId: userData.userId, userLogin: userData.userLogin },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
      },
    };

    const commentDocument = await this.create(newComment);

    return commentDocument;
  }
);

export const CommentModel = model<CommentType, CommentModelType>('comment', commentSchema);
