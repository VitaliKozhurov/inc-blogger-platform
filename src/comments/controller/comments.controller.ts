import { Response } from 'express';
import { inject, injectable } from 'inversify';

import {
  HTTP_STATUSES,
  IdParamType,
  RequestWithParamAndBodyType,
  RequestWithUriParamType,
} from '../../core/types';
import { RESULT_STATUSES, resultCodeToHttpException } from '../../core/utils';
import { CommentsService } from '../application';
import { CommentsQueryRepository } from '../repository';
import { UpdateCommentInputType } from '../types';

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsQueryRepository) private commentsQueryRepository: CommentsQueryRepository,
    @inject(CommentsService) private commentsService: CommentsService
  ) {}

  async getCommentById(req: RequestWithUriParamType, res: Response) {
    const commentViewModel = await this.commentsQueryRepository.getCommentById(req.params.id);

    if (!commentViewModel) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
    }

    return res.status(HTTP_STATUSES.OK).send(commentViewModel);
  }

  async updateCommentById(
    req: RequestWithParamAndBodyType<IdParamType, UpdateCommentInputType>,
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
}
