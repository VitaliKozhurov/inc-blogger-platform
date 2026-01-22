import { blogsRepository } from '../repository';
import { BlogDBType, CreateBlogInputType, UpdateBlogInputType } from '../types';

export const blogsService = {
  createBlog: async (blogData: CreateBlogInputType) => {
    const newBlog: BlogDBType = {
      ...blogData,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    const blogId = await blogsRepository.createBlog(newBlog);

    return blogId;
  },

  updateBlogById: async ({ id, blogData }: { id: string; blogData: UpdateBlogInputType }) => {
    return blogsRepository.updateBlogById({ id, blogData });
  },

  deleteBlogById: async (id: string) => {
    return blogsRepository.deleteBlogById(id);
  },
};
