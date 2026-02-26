import { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

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
  { collection: 'posts' }
);

export type PostType = InferSchemaType<typeof postSchema>;
export type PostDocument = HydratedDocument<PostType>;

export const PostModel = model<PostType>('post', postSchema);
