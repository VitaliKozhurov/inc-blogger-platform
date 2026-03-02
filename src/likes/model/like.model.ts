import { HydratedDocument, InferSchemaType, model, Schema, Types } from 'mongoose';

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

const likeSchema = new Schema(
  {
    status: {
      type: String,
      enum: LikeStatus,
      default: LikeStatus.None,
    },
    authorId: { type: String, required: true },
    createdAt: {
      type: Date,
      required: true,
    },
    parentId: { type: String, required: true },
  },
  { collection: 'likes', versionKey: false }
);

export type LikeType = InferSchemaType<typeof likeSchema> & {
  _id: Types.ObjectId;
};

export type LikeDocument = HydratedDocument<LikeType>;

export const LikeModel = model<LikeType>('like', likeSchema);
