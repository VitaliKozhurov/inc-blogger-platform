import { injectable } from 'inversify';

import { getPaginationParams } from '../../core/utils';
import { PostModel, PostType } from '../model';
import { PostsRequestQueryType, PostViewModelType } from '../types';

import { getPaginationData } from './../../core/utils/get-pagination-data';

@injectable()
export class PostsQueryRepository {
  async getPosts(args: PostsRequestQueryType) {
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

  async getPostById(id: string) {
    const post = await PostModel.findById(id);

    return post ? this.mapToViewModel(post) : post;
  }

  async getPostsByBlogId({ blogId, query }: { blogId: string; query: PostsRequestQueryType }) {
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

  private mapToViewModel({ _id, createdAt, ...restPost }: PostType): PostViewModelType {
    return {
      id: _id.toString(),
      createdAt: createdAt.toISOString(),
      ...restPost,
    };
  }
}
