import { blogRepository } from '../repository';
import { BlogRequestQueryType, CreateBlogInputType, UpdateBlogInputType } from '../types';

export const blogsService = {
  async getBlogs(args: BlogRequestQueryType) {
    const result = await blogRepository.getBlogs(args);

    return result;
  },
  async getBlogById(id: string) {
    return blogRepository.getBlogByIdOrFail(id);
  },
  async createBlog(blogDto: CreateBlogInputType) {
    const newBlog = {
      ...blogDto,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    const blogId = await blogRepository.createBlog(newBlog);

    return blogId;
  },
  async updateBlogById({ id, blogData }: { id: string; blogData: UpdateBlogInputType }) {
    return blogRepository.updateBlogById({ id, blogData });
  },
  async deleteBlogById(id: string) {
    return blogRepository.deleteBlogById(id);
  },
};
