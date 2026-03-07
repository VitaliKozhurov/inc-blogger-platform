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
import { RESULT_STATUSES, resultCodeToHttpException } from '../../core/utils';
import { CreatePostDTO, PostsQueryRepository, PostsRequestQueryDTO, PostsService } from '../posts';

import { BlogsQueryRepository } from './blogs-query.repository';
import { BlogsService } from './blogs.service';
import { BlogsRequestQueryDTO } from './dto/blogs-request-query.dto';
import { CreateBlogDTO } from './dto/create-blog.dto';
import { UpdateBlogDTO } from './dto/update-blog.dto';

@injectable()
export class BlogsController {
  constructor(
    @inject(BlogsService) private blogsService: BlogsService,
    @inject(BlogsQueryRepository) private blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsService) private postsService: PostsService,
    @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository
  ) {}

  async getBlogs(req: Request, res: Response) {
    const query = matchedData<BlogsRequestQueryDTO>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const blogsViewModels = await this.blogsQueryRepository.getBlogs(query);

    return res.status(HTTP_STATUSES.OK).send(blogsViewModels);
  }

  async getBlogById(req: RequestWithUriParamType, res: Response) {
    const blogViewModel = await this.blogsQueryRepository.getBlogById(req.params.id);

    if (!blogViewModel) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
    }

    return res.status(HTTP_STATUSES.OK).send(blogViewModel);
  }

  async createBlog(req: RequestWithBodyType<CreateBlogDTO>, res: Response) {
    const result = await this.blogsService.createBlog(req.body);

    const createdBlogViewModel = await this.blogsQueryRepository.getBlogById(result.data);

    return res.status(HTTP_STATUSES.CREATED).send(createdBlogViewModel);
  }

  async updateBlogById(
    req: RequestWithParamAndBodyType<IdParamType, UpdateBlogDTO>,
    res: Response
  ) {
    const result = await this.blogsService.updateBlogById({
      id: req.params.id,
      blogData: req.body,
    });

    if (result.status !== RESULT_STATUSES.OK) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  }

  async deleteBlogById(req: RequestWithUriParamType, res: Response) {
    const result = await this.blogsService.deleteBlogById(req.params.id);

    if (result.status !== RESULT_STATUSES.OK) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT);
  }

  async createPostByBlogId(
    req: RequestWithParamAndBodyType<IdParamType, Omit<CreatePostDTO, 'blogId'>>,
    res: Response
  ) {
    const blogId = req.params.id;

    const result = await this.postsService.createPost({ blogId, ...req.body });

    if (result.status !== RESULT_STATUSES.OK) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }

    const createdPostViewModel = await this.postsQueryRepository.getPostById(result.data!.id);

    res.status(HTTP_STATUSES.CREATED).send(createdPostViewModel);
  }

  async getPostsByBlogId(
    req: RequestWithParamAndQueryType<IdParamType, Record<string, string>>,
    res: Response
  ) {
    const blogId = req.params.id;

    const query = matchedData<PostsRequestQueryDTO>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const blog = await this.blogsQueryRepository.getBlogById(blogId);

    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND);
    }

    const postsViewMode = await this.postsQueryRepository.getPostsByBlogId({ blogId, query });

    return res.status(HTTP_STATUSES.OK).send(postsViewMode);
  }
}
