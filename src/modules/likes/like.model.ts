import { Model, model, Schema } from 'mongoose';

import { CreateLikeDTO } from './dto/create-like.dto';
import { LikeStatus } from './types/like-status.types';
import { LikeMethodsType, LikeStaticMethodsType, LikeType } from './types/like.types';

type LikeModelType = Model<LikeType, unknown, LikeMethodsType> & LikeStaticMethodsType;

const likeSchema = new Schema<LikeType, LikeModelType, LikeMethodsType>(
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
      parentId: args.parentId,
      likeStatus: args.likeStatus,
      createdAt: new Date(),
    };

    const likeDocument = await this.create(newLike);

    return likeDocument;
  }
);

export const LikeModel = model<LikeType, LikeModelType>('like', likeSchema);
