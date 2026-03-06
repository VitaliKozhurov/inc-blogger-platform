import { Model, model, Schema } from 'mongoose';

import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import { PostMethodsType, PostStaticMethodsType, PostType } from './types/post.types';

type PostModelType = Model<PostType, unknown, PostMethodsType> & PostStaticMethodsType;

const postSchema = new Schema<PostType, PostModelType, PostMethodsType>(
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

postSchema.method('updatePost', function updateBlog(args: UpdatePostDTO) {
  this.blogId = args.blogId;
  this.title = args.title;
  this.shortDescription = args.shortDescription;
  this.content = args.content;

  return this;
});

postSchema.static(
  'createPostInstance',
  async function createPostInstance({
    blogName,
    postData,
  }: {
    blogName: string;
    postData: CreatePostDTO;
  }): ReturnType<PostStaticMethodsType['createPostInstance']> {
    const newPost = {
      blogId: postData.blogId,
      blogName: blogName,
      title: postData.title,
      shortDescription: postData.shortDescription,
      content: postData.content,
      createdAt: new Date(),
    };

    const postDocument = await this.create(newPost);

    return postDocument;
  }
);

export const PostModel = model<PostType, PostModelType>('post', postSchema);
