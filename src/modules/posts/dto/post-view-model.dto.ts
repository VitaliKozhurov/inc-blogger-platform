import { LikeStatus } from '../../likes/types/like-status.types';

type NewestLike = {
  addedAt: string;
  userId: string;
  login: string;
};

export type PostViewModelDTO = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
    newestLikes: NewestLike[];
  };
};
