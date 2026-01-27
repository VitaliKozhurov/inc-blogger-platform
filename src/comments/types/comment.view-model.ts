import { CommentDbType } from './comment.db';

export type CommentViewModelType = { id: string } & Omit<CommentDbType, 'postId'>;
