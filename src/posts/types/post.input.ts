import { PostDBType } from './post.db';

export type CreatePostInputType = Omit<PostDBType, 'blogName' | 'createdAt'>;
export type UpdatePostInputType = Omit<PostDBType, 'isMembership' | 'blogName' | 'createdAt'>;
