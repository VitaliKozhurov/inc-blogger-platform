import { HydratedDocument } from 'mongoose';

import { CreatePostDTO } from '../dto/create-post.dto';

export type PostType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
};

export type PostDocument = HydratedDocument<PostType>;

export type PostStaticMethodsType = {
  createPostInstance(args: { blogName: string; postData: CreatePostDTO }): Promise<PostDocument>;
};
