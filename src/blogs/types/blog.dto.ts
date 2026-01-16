import { BlogEntityType } from './blog';

export type CreateBlogDTOType = BlogEntityType;
export type UpdateBlogDTOType = Omit<BlogEntityType, 'isMembership' | 'createdAt'>;
