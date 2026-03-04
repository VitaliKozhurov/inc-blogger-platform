import { inject, injectable } from 'inversify';

import { BlogsRepository } from '../repository';
import { CreateBlogInputType, UpdateBlogInputType } from '../types';
import { blogsObjectResult } from '../utils/blogs-object-result';

@injectable()
export class BlogsService {
  constructor(@inject(BlogsRepository) private blogsRepository: BlogsRepository) {}

  async createBlog(blogData: CreateBlogInputType) {
    const newBlog = {
      ...blogData,
      isMembership: false,
      createdAt: new Date(),
    };

    const blogId = await this.blogsRepository.createBlog(newBlog);

    return blogsObjectResult.success(blogId);
  }

  async updateBlogById({ id, blogData }: { id: string; blogData: UpdateBlogInputType }) {
    const blog = await this.blogsRepository.getBlogById(id);

    if (!blog) {
      return blogsObjectResult.notFoundBlog();
    }

    blog.name = blogData.name;
    blog.description = blogData.description;
    blog.websiteUrl = blogData.websiteUrl;

    await this.blogsRepository.saveBlog(blog);

    return blogsObjectResult.success();
  }

  async deleteBlogById(id: string) {
    const isDeleted = await this.blogsRepository.deleteBlogById(id);

    if (isDeleted) {
      return blogsObjectResult.success();
    }

    return blogsObjectResult.notFoundBlog();
  }
}
