import { CreateBlogDTO } from '../../../src/modules/blogs/dto/create-blog.dto';
import { UpdateBlogDTO } from '../../../src/modules/blogs/dto/update-blog.dto';

export const mockBlog: CreateBlogDTO = {
  name: 'New blog',
  description: 'Blog description',
  websiteUrl: 'https://google.com',
};

export const mockUpdatedBlog: UpdateBlogDTO = {
  name: 'Updated blog',
  description: 'Updated description',
  websiteUrl: 'https://updated-google.com',
};
