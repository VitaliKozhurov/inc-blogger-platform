import { model, Schema } from 'mongoose';

import { CommentType } from './types/comment.types';

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

const commentSchema = new Schema(
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

export const CommentModel = model<CommentType>('comment', commentSchema);
