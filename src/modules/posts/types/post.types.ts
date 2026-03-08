import { HydratedDocument } from 'mongoose';

import { CreatePostDTO } from '../dto/create-post.dto';
import { UpdatePostDTO } from '../dto/update-post.dto';

export type PostType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
  };
};

export type PostDocument = HydratedDocument<PostType, PostMethodsType>;

export type PostStaticMethodsType = {
  createPostInstance(args: { blogName: string; postData: CreatePostDTO }): Promise<PostDocument>;
};

export type PostMethodsType = {
  updatePost(args: UpdatePostDTO): PostDocument;
};
