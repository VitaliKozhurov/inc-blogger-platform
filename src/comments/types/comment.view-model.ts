import { LikeStatus } from '../../likes/model';

import { CommentDbType } from './comment.db';

type CommentLikeInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
};

export type CommentViewModelType = { id: string } & { likesInfo: CommentLikeInfo } & Omit<
    CommentDbType,
    'postId'
  >;
