import { postsRepository } from '../../posts/repository';
import { postsObjectResult } from '../../posts/utils/posts-object-result';
import { usersRepository } from '../../users/repository/users.repository';
import { commentsRepository } from '../repository';
import { CommentDbType } from '../types';
import { commentsObjectResult } from '../utils/comments-object-result';

export const commentsService = {
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

    const user = await usersRepository.getUserById(userId);

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

    const commentId = await commentsRepository.createComment(comment);

    return postsObjectResult.success({ commentId });
  },
  async updateCommentById({
    userId,
    commentId,
    content,
  }: {
    userId: string;
    commentId: string;
    content: string;
  }) {
    const comment = await commentsRepository.getCommentById(commentId);

    if (!comment) {
      return commentsObjectResult.notFoundComment();
    }

    if (comment.commentatorInfo.userId !== userId) {
      return commentsObjectResult.forbiddenCommentMutation();
    }

    const isUpdated = await commentsRepository.updateCommentById({ id: commentId, content });

    if (isUpdated) {
      return postsObjectResult.success();
    }

    return postsObjectResult.notFoundPost();
  },

  async deleteCommentById({ userId, commentId }: { userId: string; commentId: string }) {
    const comment = await commentsRepository.getCommentById(commentId);

    if (!comment) {
      return commentsObjectResult.notFoundComment();
    }

    if (comment.commentatorInfo.userId !== userId) {
      return commentsObjectResult.forbiddenCommentMutation();
    }

    const isDeleted = await commentsRepository.deleteCommentById(commentId);

    if (isDeleted) {
      return postsObjectResult.success();
    }

    return postsObjectResult.notFoundPost();
  },
};
