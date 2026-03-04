import { HydratedDocument, InferSchemaType, model, Schema, Types } from 'mongoose';

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    blogId: {
      type: String,
      required: true,
    },
    blogName: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  },
  { collection: 'posts', versionKey: false }
);

export type PostType = InferSchemaType<typeof postSchema> & {
  _id: Types.ObjectId;
};
export type PostDocument = HydratedDocument<PostType>;

export const PostModel = model<PostType>('post', postSchema);
