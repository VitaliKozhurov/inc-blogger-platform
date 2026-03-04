import { inject, injectable } from 'inversify';

import { BlogsRepository } from '../../blogs/repository';
import { PostsRepository } from '../repository';
import { CreatePostInputType, UpdatePostInputType } from '../types';
import { postsObjectResult } from '../utils/posts-object-result';

@injectable()
export class PostsService {
  constructor(
    @inject(BlogsRepository) private blogsRepository: BlogsRepository,
    @inject(PostsRepository) private postsRepository: PostsRepository
  ) {}

  async createPost(postData: CreatePostInputType) {
    const blog = await this.blogsRepository.getBlogById(postData.blogId);

    if (!blog) {
      return postsObjectResult.notFoundBlog();
    }

    const newPost = {
      ...postData,
      blogName: blog.name,
      createdAt: new Date(),
    };

    const id = await this.postsRepository.createPost(newPost);

    return postsObjectResult.success({ id });
  }

  async updatePostById({ id, postData }: { id: string; postData: UpdatePostInputType }) {
    const post = await this.postsRepository.getPostById(id);

    if (!post) {
      return postsObjectResult.notFoundPost();
    }

    post.title = postData.title;
    post.shortDescription = postData.shortDescription;
    post.content = postData.content;
    post.blogId = postData.blogId;

    await this.postsRepository.savePost(post);

    return postsObjectResult.success();
  }

  async deletePostById(blogId: string) {
    const isDeleted = await this.postsRepository.deletePostById(blogId);

    if (isDeleted) {
      return postsObjectResult.success();
    }

    return postsObjectResult.notFoundPost();
  }
}
