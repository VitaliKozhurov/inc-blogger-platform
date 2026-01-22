import { BlogDBType } from './blog.db';

export type CreateBlogInputType = Omit<BlogDBType, 'isMembership' | 'createdAt'>;
export type UpdateBlogInputType = Omit<BlogDBType, 'isMembership' | 'createdAt'>;
