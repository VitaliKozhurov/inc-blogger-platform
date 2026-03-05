import { inject, injectable } from 'inversify';

import { BlogModel } from './blog.model';
import { BlogsRepository } from './blogs.repository';
import { CreateBlogDTO } from './dto/create-blog.dto';
import { UpdateBlogDTO } from './dto/update-blog.dto';
import { blogsObjectResult } from './utils/blogs-object-result';

@injectable()
export class BlogsService {
  constructor(@inject(BlogsRepository) private blogsRepository: BlogsRepository) {}

  async createBlog(blogData: CreateBlogDTO) {
    const blogDocument = await BlogModel.createBlogInstance(blogData);

    await this.blogsRepository.saveBlog(blogDocument);

    return blogsObjectResult.success(blogDocument._id.toString());
  }

  async updateBlogById({ id, blogData }: { id: string; blogData: UpdateBlogDTO }) {
    const blog = await this.blogsRepository.getBlogById(id);

    if (!blog) {
      return blogsObjectResult.notFoundBlog();
    }

    const updatedBlog = blog.updateBlog(blogData);

    await this.blogsRepository.saveBlog(updatedBlog);

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
