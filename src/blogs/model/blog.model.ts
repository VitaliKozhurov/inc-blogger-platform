import { HydratedDocument, InferSchemaType, model, Schema, Types } from 'mongoose';

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
  { collection: 'blogs', versionKey: false }
);

export type BlogType = InferSchemaType<typeof blogSchema> & {
  _id: Types.ObjectId;
};
export type BlogDocument = HydratedDocument<BlogType>;

export const BlogModel = model<BlogType>('blog', blogSchema);
