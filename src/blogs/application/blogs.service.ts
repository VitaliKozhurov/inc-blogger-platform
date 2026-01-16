import { blogRepository } from '../repository';
import {
  BlogRequestQueryType,
  CreateBlogDTOType,
  CreateBlogInputType,
  UpdateBlogInputType,
} from '../types';

export const blogsService = {
  getBlogs: async (args: BlogRequestQueryType) => {
    const result = await blogRepository.getBlogs(args);

    return result;
  },
  getBlogById: async (id: string) => {
    return blogRepository.getBlogByIdOrFail(id);
  },
  createBlog: async (blogData: CreateBlogInputType) => {
    const newBlog: CreateBlogDTOType = {
      ...blogData,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    const blogId = await blogRepository.createBlog(newBlog);

    return blogId;
  },
  updateBlogById: async ({ id, blogData }: { id: string; blogData: UpdateBlogInputType }) => {
    return blogRepository.updateBlogById({ id, blogData });
  },
  deleteBlogById: async (id: string) => {
    return blogRepository.deleteBlogById(id);
  },
};
