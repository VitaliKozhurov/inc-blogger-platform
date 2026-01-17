import { PostEntityType } from './post';

export type CreatePostInputType = Omit<PostEntityType, 'blogName' | 'createdAt'>;
export type UpdatePostInputType = Omit<PostEntityType, 'isMembership' | 'blogName' | 'createdAt'>;
