import { model, Schema } from 'mongoose';

import { LikeStatus } from './types/like-status.types';
import { LikeType } from './types/like.types';

const likeSchema = new Schema(
  {
    authorId: { type: String, required: true },
    parentId: { type: String, required: true },
    createdAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: LikeStatus,
      default: LikeStatus.None,
    },
  },
  { collection: 'likes', versionKey: false }
);

export const LikeModel = model<LikeType>('like', likeSchema);
