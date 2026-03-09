import { HydratedDocument } from 'mongoose';

import { LikeStatus } from '../../likes/types/like-status.types';
import { LikeDocument } from '../../likes/types/like.types';
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
  updatePostLikesByIncomingLikeStatus(likeStatus: LikeStatus): PostDocument;
  updatePostLikesByIncomingLikeStatusAndLike(args: {
    like: LikeDocument;
    likeStatus: LikeStatus;
  }): PostDocument;
};
