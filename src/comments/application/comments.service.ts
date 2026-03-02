import { inject, injectable } from 'inversify';

import { LikeModel, LikeStatus, LikeType } from '../../likes/model';
import { LikesRepository } from '../../likes/repository';
import { PostsRepository } from '../../posts/repository';
import { postsObjectResult } from '../../posts/utils/posts-object-result';
import { UsersRepository } from '../../users/repository';
import { CommentsRepository } from '../repository';
import { commentsObjectResult } from '../utils/comments-object-result';

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
      return postsObjectResult.notFoundPost();
    }

    const user = await this.usersRepository.getUserById(userId);

    if (!user) {
      return postsObjectResult.badRequest();
    }

    const comment = {
      content,
      createdAt: new Date(),
      postId,
      commentatorInfo: { userId, userLogin: user.login },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
      },
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

    comment.content = content;

    await this.commentsRepository.saveComment(comment);

    return postsObjectResult.success();
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
      return commentsObjectResult.notFoundComment();
    }

    const like = await this.likesRepository.findByFilter({ parentId: commentId, authorId: userId });

    if (!like) {
      const like: Omit<LikeType, '_id'> = {
        authorId: userId,
        createdAt: new Date(),
        parentId: comment.id,
        status: likeStatus,
      };

      if (likeStatus === LikeStatus.Like) {
        comment.likesInfo.likesCount += 1;
      }

      if (likeStatus === LikeStatus.Dislike) {
        comment.likesInfo.dislikesCount += 1;
      }

      await LikeModel.create(like);

      return commentsObjectResult.success();
    }

    if (likeStatus === like.status) {
      return commentsObjectResult.success();
    }

    if (likeStatus === LikeStatus.Like) {
      like.status = likeStatus;
    }

    if (likeStatus === LikeStatus.Dislike) {
      like.status = likeStatus;
    }

    if (likeStatus === LikeStatus.None) {
      like.status = likeStatus;
    }
  }
}
