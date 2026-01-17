import { PostEntityType } from './post';

export type CreatePostDTOType = PostEntityType;
export type UpdatePostDTOType = Omit<PostEntityType, 'blogName' | 'createdAt'>;
