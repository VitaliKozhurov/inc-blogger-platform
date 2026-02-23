import { inject, injectable } from 'inversify';

import { postsRepository } from '../../posts/repository';
import { postsObjectResult } from '../../posts/utils/posts-object-result';
import { UsersRepository } from '../../users/repository';
import { CommentsRepository } from '../repository';
import { CommentDbType } from '../types';
import { commentsObjectResult } from '../utils/comments-object-result';

@injectable()
export class CommentsService {
  constructor(
    @inject(UsersRepository) private usersRepository: UsersRepository,
    @inject(CommentsRepository) private commentsRepository: CommentsRepository
  ) {}

  async createCommentByPostId({
    postId,
    userId,
    content,
  }: {
    postId: string;
    userId: string;
    content: string;
  }) {
    const post = await postsRepository.getPostById(postId);

    if (!post) {
      return postsObjectResult.notFoundPost();
    }

    const user = await this.usersRepository.getUserById(userId);

    if (!user) {
      return postsObjectResult.badRequest();
    }

    const comment: CommentDbType = {
      content,
      createdAt: new Date().toISOString(),
      commentatorInfo: {
        userId: user._id.toString(),
        userLogin: user.login,
      },
      postId,
    };

    const commentId = await this.commentsRepository.createComment(comment);

    return postsObjectResult.success({ commentId });
  }

  async updateCommentById({
    userId,
    commentId,
    content,
  }: {
    userId: string;
    commentId: string;
    content: string;
  }) {
    const comment = await this.commentsRepository.getCommentById(commentId);

    if (!comment) {
      return commentsObjectResult.notFoundComment();
    }

    if (comment.commentatorInfo.userId !== userId) {
      return commentsObjectResult.forbiddenCommentMutation();
    }

    const isUpdated = await this.commentsRepository.updateCommentById({ id: commentId, content });

    if (isUpdated) {
      return postsObjectResult.success();
    }

    return postsObjectResult.notFoundPost();
  }

  async deleteCommentById({ userId, commentId }: { userId: string; commentId: string }) {
    const comment = await this.commentsRepository.getCommentById(commentId);

    if (!comment) {
      return commentsObjectResult.notFoundComment();
    }

    if (comment.commentatorInfo.userId !== userId) {
      return commentsObjectResult.forbiddenCommentMutation();
    }

    const isDeleted = await this.commentsRepository.deleteCommentById(commentId);

    if (isDeleted) {
      return postsObjectResult.success();
    }

    return postsObjectResult.notFoundPost();
  }
}
