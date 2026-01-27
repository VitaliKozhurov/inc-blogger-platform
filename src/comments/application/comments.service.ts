import { HTTP_STATUSES } from '../../core/types';
import { postsQWRepository } from '../../posts/repository';
import { usersQWRepository } from '../../users/repository';
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
    const post = await postsQWRepository.getPostById(postId);

    if (!post) {
      return {
        status: HTTP_STATUSES.NOT_FOUND,
        data: null,
        errorMessage: 'Post not exist',
        extensions: [{ field: null, message: 'Post not exist' }],
      };
    }

    const user = await usersQWRepository.getUserById(userId);

    if (!user) {
      return {
        status: HTTP_STATUSES.BAD_REQUEST,
        data: null,
        errorMessage: 'Incorrect user',
        extensions: [{ field: null, message: 'Incorrect user' }],
      };
    }

    const comment: CommentDbType = {
      content,
      createdAt: new Date().toISOString(),
      commentatorInfo: {
        userId: user.id,
        userLogin: user.login,
      },
      postId,
    };

    const commentId = await commentsRepository.createComment(comment);

    return {
      status: HTTP_STATUSES.OK,
      data: { commentId },
      extensions: [],
    };
  },
  async updateCommentById({ id, content }: { id: string; content: string }) {
    return commentsRepository.updateCommentById({ id, content });
  },
  async deleteCommentById(id: string) {
    return commentsRepository.deleteCommentById(id);
  },
};
