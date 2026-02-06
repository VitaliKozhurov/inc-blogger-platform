import { CreateBlogInputType, UpdateBlogInputType } from '../../../src/blogs/types';

export const mockBlog: CreateBlogInputType = {
  name: 'New blog',
  description: 'Blog description',
  websiteUrl: 'https://google.com',
};

export const mockUpdatedBlog: UpdateBlogInputType = {
  name: 'Updated blog',
  description: 'Updated description',
  websiteUrl: 'https://updated-google.com',
};
