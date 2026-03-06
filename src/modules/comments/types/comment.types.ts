import { HydratedDocument } from 'mongoose';

export type CommentType = {
  content: string;
  createdAt: Date;
  postId: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
  };
};

export type CommentDocument = HydratedDocument<CommentType>;
