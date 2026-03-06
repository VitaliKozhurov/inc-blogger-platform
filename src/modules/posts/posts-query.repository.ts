import { injectable } from 'inversify';
import { Types } from 'mongoose';

import { getPaginationParams } from '../../core/utils';

import { getPaginationData } from './../../core/utils/get-pagination-data';
import { PostViewModelDTO } from './dto/post-view-model.dto';
import { PostsRequestQueryDTO } from './dto/posts-request-query.dto';
import { PostModel } from './post.model';
import { PostType } from './types/post.types';

type PostMapInputType = { _id: Types.ObjectId } & PostType;

@injectable()
export class PostsQueryRepository {
  async getPostById(id: string) {
    const post = await PostModel.findById(id).lean().exec();

    return post ? this.mapToViewModel(post) : post;
  }
  async getPosts(args: PostsRequestQueryDTO) {
    const { sort, limit, skip } = getPaginationParams(args);

    const [items, totalCount] = await Promise.all([
      PostModel.find().lean().sort(sort).skip(skip).limit(limit),
      PostModel.countDocuments(),
    ]);

    const paginationData = getPaginationData({
      items: items.map(this.mapToViewModel),
      pageNumber: args.pageNumber,
      pageSize: args.pageSize,
      totalCount,
    });

    return paginationData;
  }

  async getPostsByBlogId({ blogId, query }: { blogId: string; query: PostsRequestQueryDTO }) {
    const { sort, skip, limit } = getPaginationParams(query);

    const [items, totalCount] = await Promise.all([
      PostModel.find({ blogId }).lean().sort(sort).skip(skip).limit(limit),
      PostModel.countDocuments({ blogId }),
    ]);

    const paginationData = getPaginationData({
      items: items.map(this.mapToViewModel),
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
    });

    return paginationData;
  }

  private mapToViewModel({ _id, createdAt, ...restPost }: PostMapInputType): PostViewModelDTO {
    return {
      id: _id.toString(),
      createdAt: createdAt.toISOString(),
      ...restPost,
    };
  }
}
