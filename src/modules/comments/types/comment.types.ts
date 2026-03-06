import { HydratedDocument } from 'mongoose';

export type CommentType = {
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  postId: string;
};

export type CommentDocument = HydratedDocument<CommentType>;
