import { HydratedDocument, InferSchemaType, model, Schema, Types } from 'mongoose';

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
      type: {
        userId: {
          type: String,
          required: true,
        },
        userLogin: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    dislikesCount: {
      type: Number,
      default: 0,
    },
  },
  { collection: 'blogs' }
);

export type CommentType = InferSchemaType<typeof commentSchema> & {
  _id: Types.ObjectId;
};
export type CommentDocument = HydratedDocument<CommentType>;

export const CommentModel = model<CommentType>('comment', commentSchema);
