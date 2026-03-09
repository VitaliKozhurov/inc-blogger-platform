import { Model, model, Schema } from 'mongoose';

import { LikeStatus } from '../likes/types/like-status.types';

import { LikeDocument } from './../likes/types/like.types';
import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import { PostMethodsType, PostStaticMethodsType, PostType } from './types/post.types';

type PostModelType = Model<PostType, unknown, PostMethodsType> & PostStaticMethodsType;

const postLikeSchema = new Schema(
  {
    likesCount: {
      type: Number,
      default: 0,
    },
    dislikesCount: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

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
    extendedLikesInfo: {
      type: postLikeSchema,
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

postSchema.method(
  'updatePostLikesByIncomingLikeStatus',
  function updatePostLikesByIncomingLikeStatus(likeStatus: LikeStatus) {
    if (likeStatus === LikeStatus.Like) {
      this.extendedLikesInfo.likesCount += 1;
    }

    if (likeStatus === LikeStatus.Dislike) {
      this.extendedLikesInfo.dislikesCount += 1;
    }

    return this;
  }
);

postSchema.method(
  'updatePostLikesByIncomingLikeStatusAndLike',
  function updatePostLikesByIncomingLikeStatusAndLike(args: {
    like: LikeDocument;
    likeStatus: LikeStatus;
  }) {
    const { like, likeStatus } = args;

    if (like.status === LikeStatus.Like) {
      if (likeStatus === LikeStatus.Dislike) {
        this.extendedLikesInfo.dislikesCount += 1;
        this.extendedLikesInfo.likesCount -= 1;
      }

      if (likeStatus === LikeStatus.None) {
        this.extendedLikesInfo.likesCount -= 1;
      }
    }

    if (like.status === LikeStatus.Dislike) {
      if (likeStatus === LikeStatus.Like) {
        this.extendedLikesInfo.likesCount += 1;
        this.extendedLikesInfo.dislikesCount -= 1;
      }

      if (likeStatus === LikeStatus.None) {
        this.extendedLikesInfo.dislikesCount -= 1;
      }
    }

    if (like.status === LikeStatus.None) {
      if (likeStatus === LikeStatus.Like) {
        this.extendedLikesInfo.likesCount += 1;
      }

      if (likeStatus === LikeStatus.Dislike) {
        this.extendedLikesInfo.dislikesCount += 1;
      }
    }

    this.extendedLikesInfo.likesCount = Math.max(0, this.extendedLikesInfo.likesCount);
    this.extendedLikesInfo.dislikesCount = Math.max(0, this.extendedLikesInfo.dislikesCount);

    return this;
  }
);

postSchema.static(
  'createPostInstance',
  async function createPostInstance({
    blogName,
    postData,
  }: {
    blogName: string;
    postData: CreatePostDTO;
  }): ReturnType<PostStaticMethodsType['createPostInstance']> {
    const newPost: PostType = {
      blogId: postData.blogId,
      blogName: blogName,
      title: postData.title,
      shortDescription: postData.shortDescription,
      content: postData.content,
      createdAt: new Date(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
      },
    };

    const postDocument = await this.create(newPost);

    return postDocument;
  }
);

export const PostModel = model<PostType, PostModelType>('post', postSchema);
