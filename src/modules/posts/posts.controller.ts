import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { inject, injectable } from 'inversify';

import {
  HTTP_STATUSES,
  IdParamType,
  RequestWithBodyType,
  RequestWithParamAndBodyType,
  RequestWithParamAndQueryType,
  RequestWithUriParamType,
} from '../../core/types';
import {
  getUserIdFromAccessToken,
  RESULT_STATUSES,
  resultCodeToHttpException,
} from '../../core/utils';
import { CommentsQueryRepository } from '../comments/comments-query.repository';
import { CommentsService } from '../comments/comments.service';
import { CommentsRequestQueryDTO } from '../comments/dto/comment-request-type.dto';
import { CreateCommentDTO } from '../comments/dto/create-comment.dto';

import { CreatePostDTO } from './dto/create-post.dto';
import { PostsRequestQueryDTO } from './dto/posts-request-query.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import { PostsQueryRepository } from './posts-query.repository';
import { PostsService } from './posts.service';

@injectable()
export class PostsController {
  constructor(
    @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
    @inject(PostsService) private postsService: PostsService,
    @inject(CommentsService) private commentsService: CommentsService,
    @inject(CommentsQueryRepository) private commentsQueryRepository: CommentsQueryRepository
  ) {}

  async getPosts(req: Request, res: Response) {
    const query = matchedData<PostsRequestQueryDTO>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const postsViewModels = await this.postsQueryRepository.getPosts(query);

    res.status(HTTP_STATUSES.OK).send(postsViewModels);
  }

  async getPostById(req: RequestWithUriParamType, res: Response) {
    const postViewModel = await this.postsQueryRepository.getPostById(req.params.id);

    if (!postViewModel) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
    }

    return res.status(HTTP_STATUSES.OK).send(postViewModel);
  }

  async createPost(req: RequestWithBodyType<CreatePostDTO>, res: Response) {
    const result = await this.postsService.createPost(req.body);

    if (result.status !== RESULT_STATUSES.OK) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }

    const createdPostViewModel = await this.postsQueryRepository.getPostById(result.data!.id);

    return res.status(HTTP_STATUSES.CREATED).send(createdPostViewModel);
  }

  async updatePostById(
    req: RequestWithParamAndBodyType<IdParamType, UpdatePostDTO>,
    res: Response
  ) {
    const result = await this.postsService.updatePostById({
      id: req.params.id,
      postData: req.body,
    });

    if (result.status !== RESULT_STATUSES.OK) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  }

  async deletePostById(req: RequestWithUriParamType, res: Response) {
    const result = await this.postsService.deletePostById(req.params.id);

    if (result.status !== RESULT_STATUSES.OK) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  }

  async getCommentsByPostId(
    req: RequestWithParamAndQueryType<IdParamType, Record<string, string>>,
    res: Response
  ) {
    const postId = req.params.id;
    const userId = getUserIdFromAccessToken(req.headers.authorization) ?? undefined;

    const query = matchedData<CommentsRequestQueryDTO>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const post = await this.postsQueryRepository.getPostById(postId);

    if (!post) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
    }

    const commentsViewModel = await this.commentsQueryRepository.getCommentsByPostId({
      userId,
      postId,
      query,
    });

    return res.status(HTTP_STATUSES.OK).send(commentsViewModel);
  }

  async createCommentByPostId(
    req: RequestWithParamAndBodyType<IdParamType, CreateCommentDTO>,
    res: Response
  ) {
    const userId = req.userId!;

    const result = await this.commentsService.createCommentByPostId({
      postId: req.params.id,
      userId: userId,
      content: req.body.content,
    });

    if (result.status !== RESULT_STATUSES.OK) {
      return res.sendStatus(result.status);
    }

    const createdCommentViewModel = await this.commentsQueryRepository.getCommentById({
      commentId: result.data!.commentId,
      userId,
    });

    return res.status(HTTP_STATUSES.CREATED).send(createdCommentViewModel);
  }
}
