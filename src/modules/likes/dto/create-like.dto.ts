import { LikeStatus } from '../types/like-status.types';

export type CreateLikeDTO = {
  authorId: string;
  parentId: string;
  likeStatus: LikeStatus;
};
