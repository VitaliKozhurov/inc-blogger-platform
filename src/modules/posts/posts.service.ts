import { inject, injectable } from 'inversify';

import { BlogsRepository } from '../blogs/blogs.repository';
import { LikeModel } from '../likes/like.model';
import { LikesRepository } from '../likes/likes.repository';
import { LikeStatus } from '../likes/types/like-status.types';

import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import { PostModel } from './post.model';
import { PostsRepository } from './posts.repository';
import { postsObjectResult } from './utils/posts-object-result';

@injectable()
export class PostsService {
  constructor(
    @inject(BlogsRepository) private blogsRepository: BlogsRepository,
    @inject(PostsRepository) private postsRepository: PostsRepository,
    @inject(LikesRepository) private likesRepository: LikesRepository
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

  async updatePostLikeStatus({
    userId,
    login,
    postId,
    likeStatus,
  }: {
    userId: string;
    login: string;
    postId: string;
    likeStatus: LikeStatus;
  }) {
    const post = await this.postsRepository.getPostById(postId);

    if (!post) {
      return postsObjectResult.notFoundPost();
    }

    const parentId = post._id.toString();

    const like = await this.likesRepository.findByFilter({
      parentId,
      authorId: userId,
    });

    if (!like) {
      if (likeStatus === LikeStatus.None) {
        return postsObjectResult.success();
      }

      const likeDocument = await LikeModel.createLikeInstance({
        authorId: userId,
        login,
        parentId,
        likeStatus,
      });

      const postDocument = post.updatePostLikesByIncomingLikeStatus(likeStatus);

      await this.likesRepository.saveLike(likeDocument);
      await this.postsRepository.savePost(postDocument);

      return postsObjectResult.success();
    }

    if (likeStatus === like.status) {
      return postsObjectResult.success();
    }

    const postDocument = post.updatePostLikesByIncomingLikeStatusAndLike({
      like,
      likeStatus,
    });

    const likeDocument = like.updateLikeStatus(likeStatus);

    await this.likesRepository.saveLike(likeDocument);
    await this.postsRepository.savePost(postDocument);

    return postsObjectResult.success();
  }
}
