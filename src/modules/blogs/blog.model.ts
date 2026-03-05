import { model, Schema } from 'mongoose';

import { BlogType } from './types/blog.types';

const blogSchema = new Schema<BlogType>(
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

export const BlogModel = model<BlogType>('blog', blogSchema);
