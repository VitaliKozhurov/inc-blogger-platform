import { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

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
  },
  { collection: 'blogs' }
);

export type CommentType = InferSchemaType<typeof commentSchema>;
export type CommentDocument = HydratedDocument<CommentType>;

export const CommentModel = model<CommentType>('comment', commentSchema);
