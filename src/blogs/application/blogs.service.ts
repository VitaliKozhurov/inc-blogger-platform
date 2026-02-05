import { blogsRepository } from '../repository';
import { BlogDBType, CreateBlogInputType, UpdateBlogInputType } from '../types';
import { blogsObjectResult } from '../utils/blogs-object-result';

export const blogsService = {
  createBlog: async (blogData: CreateBlogInputType) => {
    const newBlog: BlogDBType = {
      ...blogData,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    const blogId = await blogsRepository.createBlog(newBlog);

    return blogsObjectResult.success(blogId);
  },

  updateBlogById: async ({ id, blogData }: { id: string; blogData: UpdateBlogInputType }) => {
    const isUpdated = await blogsRepository.updateBlogById({ id, blogData });

    if (isUpdated) {
      return blogsObjectResult.success();
    }

    return blogsObjectResult.notFoundBlog();
  },

  deleteBlogById: async (id: string) => {
    return blogsRepository.deleteBlogById(id);
  },
};
