import { Model, model, Schema } from 'mongoose';

import { CreateLikeDTO } from './dto/create-like.dto';
import { LikeStatus } from './types/like-status.types';
import { LikeMethodsType, LikeStaticMethodsType, LikeType } from './types/like.types';

type LikeModelType = Model<LikeType, unknown, LikeMethodsType> & LikeStaticMethodsType;

const likeSchema = new Schema<LikeType, LikeModelType, LikeMethodsType>(
  {
    authorId: { type: String, required: true },
    login: { type: String, required: true },
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
    addedLikeDate: {
      type: Date,
      default: null,
    },
  },
  { collection: 'likes', versionKey: false }
);

likeSchema.index({ parentId: 1, status: 1, addedLikeDate: -1 });

likeSchema.method('updateLikeStatus', function updateLikeStatus(likeStatus: LikeStatus) {
  this.status = likeStatus;

  return this;
});

likeSchema.static(
  'createLikeInstance',
  async function createLikeInstance(
    args: CreateLikeDTO
  ): ReturnType<LikeStaticMethodsType['createLikeInstance']> {
    const newLike = {
      authorId: args.authorId,
      login: args.login,
      parentId: args.parentId,
      status: args.likeStatus,
      createdAt: new Date(),
      addedLikeDate: args.likeStatus === LikeStatus.Like ? new Date() : null,
    };

    const likeDocument = await this.create(newLike);

    return likeDocument;
  }
);

export const LikeModel = model<LikeType, LikeModelType>('like', likeSchema);
