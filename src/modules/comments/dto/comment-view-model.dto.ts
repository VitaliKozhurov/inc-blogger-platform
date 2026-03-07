import { LikeStatus } from '../../likes/types/like-status.types';

export type CommentViewModelDTO = {
  id: string;
  content: string;
  commentatorInfo: { userId: string; userLogin: string };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  };
};
