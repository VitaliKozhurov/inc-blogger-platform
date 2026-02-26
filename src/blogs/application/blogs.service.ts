import { inject, injectable } from 'inversify';

import { BlogsRepository } from '../repository';
import { BlogDBType, CreateBlogInputType, UpdateBlogInputType } from '../types';
import { blogsObjectResult } from '../utils/blogs-object-result';

@injectable()
export class BlogsService {
  constructor(@inject(BlogsRepository) private blogsRepository: BlogsRepository) {}

  async createBlog(blogData: CreateBlogInputType) {
    const newBlog: BlogDBType = {
      ...blogData,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    const blogId = await this.blogsRepository.createBlog(newBlog);

    return blogsObjectResult.success(blogId);
  }

  async updateBlogById({ id, blogData }: { id: string; blogData: UpdateBlogInputType }) {
    const isUpdated = await this.blogsRepository.updateBlogById({ id, blogData });

    if (isUpdated) {
      return blogsObjectResult.success();
    }

    return blogsObjectResult.notFoundBlog();
  }

  async deleteBlogById(id: string) {
    const isDeleted = await this.blogsRepository.deleteBlogById(id);

    if (isDeleted) {
      return blogsObjectResult.success();
    }

    return blogsObjectResult.notFoundBlog();
  }
}
