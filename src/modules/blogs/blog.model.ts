import { Model, model, Schema } from 'mongoose';

import { CreateBlogDTO } from './dto/create-blog.dto';
import { UpdateBlogDTO } from './dto/update-blog.dto';
import { BlogMethodsType, BlogStaticMethodsType, BlogType } from './types/blog.types';

type BlogModelType = Model<BlogType> & BlogStaticMethodsType;

const blogSchema = new Schema<BlogType, BlogModelType, BlogMethodsType>(
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

blogSchema.method('updateBlog', function updateBlog(args: UpdateBlogDTO) {
  this.name = args.name;
  this.description = args.description;
  this.websiteUrl = args.websiteUrl;

  return this;
});

blogSchema.static(
  'createBlogInstance',
  async function createBlogInstance(
    args: CreateBlogDTO
  ): ReturnType<BlogStaticMethodsType['createBlogInstance']> {
    const newBlog = {
      name: args.name,
      description: args.description,
      websiteUrl: args.websiteUrl,
      isMembership: false,
      createdAt: new Date(),
    };

    const blogDocument = await this.create(newBlog);

    return blogDocument;
  }
);

export const BlogModel = model<BlogType, BlogModelType, BlogMethodsType>('blog', blogSchema);
