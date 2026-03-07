import { inject, injectable } from 'inversify';

import { LikeModel } from '../likes/like.model';
import { LikesRepository } from '../likes/likes.repository';
import { LikeStatus } from '../likes/types/like-status.types';
import { PostsRepository } from '../posts/posts.repository';
import { UsersRepository } from '../users/users.repository';

import { CommentModel } from './comment.model';
import { CommentsRepository } from './comments.repository';
import { commentsObjectResult } from './utils/comments-object-result';

@injectable()
export class CommentsService {
  constructor(
    @inject(UsersRepository) private usersRepository: UsersRepository,
    @inject(PostsRepository) private postsRepository: PostsRepository,
    @inject(CommentsRepository) private commentsRepository: CommentsRepository,
    @inject(LikesRepository) private likesRepository: LikesRepository
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
    const post = await this.postsRepository.getPostById(postId);

    if (!post) {
      return commentsObjectResult.notFoundError('post');
    }

    const user = await this.usersRepository.getUserById(userId);

    if (!user) {
      return commentsObjectResult.notFoundError('user');
    }

    const commentDocument = await CommentModel.createCommentInstance({
      postId,
      commentData: { content },
      userData: { userId, userLogin: user.login },
    });

    await this.commentsRepository.saveComment(commentDocument);

    return commentsObjectResult.success({ commentId: commentDocument._id.toString() });
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
      return commentsObjectResult.notFoundError('comment');
    }

    if (!comment.isCommentOwner(userId)) {
      return commentsObjectResult.forbiddenCommentMutation();
    }

    const commentDocument = comment.updateComment({ content });

    await this.commentsRepository.saveComment(commentDocument);

    return commentsObjectResult.success();
  }

  async deleteCommentById({ userId, commentId }: { userId: string; commentId: string }) {
    const comment = await this.commentsRepository.getCommentById(commentId);

    if (!comment) {
      return commentsObjectResult.notFoundError('comment');
    }

    if (comment.commentatorInfo.userId !== userId) {
      return commentsObjectResult.forbiddenCommentMutation();
    }

    const isDeleted = await this.commentsRepository.deleteCommentById(commentId);

    if (isDeleted) {
      return commentsObjectResult.success();
    }

    return commentsObjectResult.notFoundError('post');
  }

  async updateCommentLikeStatus({
    userId,
    commentId,
    likeStatus,
  }: {
    userId: string;
    commentId: string;
    likeStatus: LikeStatus;
  }) {
    const comment = await this.commentsRepository.getCommentById(commentId);

    if (!comment) {
      return commentsObjectResult.notFoundError('comment');
    }

    const parentId = comment._id.toString();

    const like = await this.likesRepository.findByFilter({
      parentId,
      authorId: userId,
    });

    if (!like) {
      if (likeStatus === LikeStatus.None) {
        return commentsObjectResult.success();
      }

      const likeDocument = await LikeModel.createLikeInstance({
        authorId: userId,
        parentId,
        likeStatus,
      });

      const commentDocument = comment.updateCommentLikesByIncomingLikeStatus(likeStatus);

      await this.likesRepository.saveLike(likeDocument);
      await this.commentsRepository.saveComment(commentDocument);

      return commentsObjectResult.success();
    }

    if (likeStatus === like.status) {
      return commentsObjectResult.success();
    }

    const commentDocument = comment.updateCommentLikesByIncomingLikeStatusAndLike({
      like,
      likeStatus,
    });

    const likeDocument = like.updateLikeStatus(likeStatus);

    await this.likesRepository.saveLike(likeDocument);
    await this.commentsRepository.saveComment(commentDocument);

    return commentsObjectResult.success();
  }
}
