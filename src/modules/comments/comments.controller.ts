import { Response } from 'express';
import { inject, injectable } from 'inversify';

import {
  HTTP_STATUSES,
  IdParamType,
  RequestWithParamAndBodyType,
  RequestWithUriParamType,
} from '../../core/types';
import { RESULT_STATUSES, resultCodeToHttpException } from '../../core/utils';

import { getUserIdFromAccessToken } from './../../core/utils/get-user-id-from-access-token';
import { CommentsQueryRepository } from './comments-query.repository';
import { CommentsService } from './comments.service';
import { UpdateCommentLikeStatusDTO } from './dto/update-comment-like-status.dto';
import { UpdateCommentDTO } from './dto/update-comment.dto';

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsQueryRepository) private commentsQueryRepository: CommentsQueryRepository,
    @inject(CommentsService) private commentsService: CommentsService
  ) {}

  async getCommentById(req: RequestWithUriParamType, res: Response) {
    const commentId = req.params.id;

    const userId = getUserIdFromAccessToken(req.headers.authorization) ?? undefined;

    const commentViewModel = await this.commentsQueryRepository.getCommentById({
      commentId,
      userId,
    });

    if (!commentViewModel) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
    }

    return res.status(HTTP_STATUSES.OK).send(commentViewModel);
  }

  async updateCommentById(
    req: RequestWithParamAndBodyType<IdParamType, UpdateCommentDTO>,
    res: Response
  ) {
    const userId = req.userId!;
    const commentId = req.params.id;
    const content = req.body.content;

    const result = await this.commentsService.updateCommentById({ userId, commentId, content });

    if (result.status !== RESULT_STATUSES.OK) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  }

  async deleteCommentById(req: RequestWithUriParamType, res: Response) {
    const userId = req.userId!;
    const commentId = req.params.id;

    const result = await this.commentsService.deleteCommentById({ userId, commentId });

    if (result.status !== RESULT_STATUSES.OK) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  }

  async updateCommentLikeStatus(
    req: RequestWithParamAndBodyType<IdParamType, UpdateCommentLikeStatusDTO>,
    res: Response
  ) {
    const userId = req.userId!;
    const login = req.login!;
    const commentId = req.params.id;
    const likeStatus = req.body.likeStatus;

    const result = await this.commentsService.updateCommentLikeStatus({
      userId,
      login,
      commentId,
      likeStatus,
    });

    if (result.status !== RESULT_STATUSES.OK) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  }
}
