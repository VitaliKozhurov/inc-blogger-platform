import { BlogEntityType } from './blog';

export type CreateBlogInputType = Omit<BlogEntityType, 'isMembership' | 'createdAt'>;
export type UpdateBlogInputType = Omit<BlogEntityType, 'isMembership' | 'createdAt'>;
