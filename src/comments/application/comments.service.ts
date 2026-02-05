import { postsRepository } from '../../posts/repository';
import { postsObjectResult } from '../../posts/utils/posts-object-result';
import { usersRepository } from '../../users/repository/users.repository';
import { commentsRepository } from '../repository';
import { CommentDbType } from '../types';

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
  async updateCommentById({ id, content }: { id: string; content: string }) {
    const isUpdated = await commentsRepository.updateCommentById({ id, content });

    if (isUpdated) {
      return postsObjectResult.success();
    }

    return postsObjectResult.notFoundPost();
  },
  async deleteCommentById(id: string) {
    const isDeleted = await commentsRepository.deleteCommentById(id);

    if (isDeleted) {
      return postsObjectResult.success();
    }

    return postsObjectResult.notFoundPost();
  },
};
