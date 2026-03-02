import { LikeStatus } from '../../likes/model';

import { CommentDbType } from './comment.db';

export type CreateCommentInputType = Pick<CommentDbType, 'content'>;
export type UpdateCommentInputType = Pick<CommentDbType, 'content'>;
export type UpdateCommentLikeStatusInputType = {
  likeStatus: LikeStatus;
};
