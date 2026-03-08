import { LikeStatus } from '../types/like-status.types';

export type CreateLikeDTO = {
  authorId: string;
  login: string;
  parentId: string;
  likeStatus: LikeStatus;
};
