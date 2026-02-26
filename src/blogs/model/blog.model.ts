import { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

const blogSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    websiteUrl: {
      type: String,
      required: true,
    },
    isMembership: {
      type: Boolean,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  },
  { collection: 'blogs' }
);

export type BlogType = InferSchemaType<typeof blogSchema>;
export type BlogDocument = HydratedDocument<BlogType>;

export const BlogModel = model<BlogType>('blog', blogSchema);
