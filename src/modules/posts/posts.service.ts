import { inject, injectable } from 'inversify';

import { BlogsRepository } from '../blogs/blogs.repository';

import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import { PostModel } from './post.model';
import { PostsRepository } from './posts.repository';
import { postsObjectResult } from './utils/posts-object-result';

@injectable()
export class PostsService {
  constructor(
    @inject(BlogsRepository) private blogsRepository: BlogsRepository,
    @inject(PostsRepository) private postsRepository: PostsRepository
  ) {}

  async createPost(postData: CreatePostDTO) {
    const blog = await this.blogsRepository.getBlogById(postData.blogId);

    if (!blog) {
      return postsObjectResult.notFoundBlog();
    }

    const postDocument = await PostModel.createPostInstance({ blogName: blog.name, postData });

    await this.postsRepository.savePost(postDocument);

    return postsObjectResult.success({ id: postDocument._id.toString() });
  }

  async updatePostById({ id, postData }: { id: string; postData: UpdatePostDTO }) {
    const post = await this.postsRepository.getPostById(id);

    if (!post) {
      return postsObjectResult.notFoundPost();
    }

    const updatedPost = post.updatePost(postData);

    await this.postsRepository.savePost(updatedPost);

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
