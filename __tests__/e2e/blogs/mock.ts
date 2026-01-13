import { BlogInputDTO } from '../../../src/blogs/types/blog';

export const mockBlog: BlogInputDTO = {
  name: 'New blog',
  description: 'Blog description',
  websiteUrl: 'https://google.com',
};

export const mockUpdatedBlog: BlogInputDTO = {
  name: 'Updated blog',
  description: 'Updated description',
  websiteUrl: 'https://updated-google.com',
};
