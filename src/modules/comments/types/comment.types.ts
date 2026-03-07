import { HydratedDocument } from 'mongoose';

import { LikeStatus } from '../../likes/types/like-status.types';
import { LikeDocument } from '../../likes/types/like.types';
import { CreateCommentDTO } from '../dto/create-comment.dto';
import { UpdateCommentDTO } from '../dto/update-comment.dto';

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

export type CommentDocument = HydratedDocument<CommentType, CommentMethodsType>;

export type CommentStaticMethodsType = {
  createCommentInstance(args: {
    postId: string;
    commentData: CreateCommentDTO;
    userData: { userId: string; userLogin: string };
  }): Promise<CommentDocument>;
};

export type CommentMethodsType = {
  verifyCommentOwnership(userId: string): boolean;
  updateComment(commentData: UpdateCommentDTO): CommentDocument;
  updateCommentLikesByIncomingLikeStatusAndLike(args: {
    like: LikeDocument;
    likeStatus: LikeStatus;
  }): CommentDocument;
  updateCommentLikesByIncomingLikeStatus(likeStatus: LikeStatus): CommentDocument;
};
