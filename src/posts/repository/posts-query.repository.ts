import { injectable } from 'inversify';
import { ObjectId, WithId } from 'mongodb';

import { getPaginationParams } from '../../core/utils';
import { postsCollection } from '../../db';
import { PostDBType, PostsRequestQueryType, PostViewModelType } from '../types';

import { getPaginationData } from './../../core/utils/get-pagination-data';

@injectable()
export class PostsQueryRepository {
  async getPosts(args: PostsRequestQueryType) {
    const { sort, limit, skip } = getPaginationParams(args);

    const items = await postsCollection.find({}).sort(sort).skip(skip).limit(limit).toArray();

    const totalCount = await postsCollection.countDocuments();

    const paginationData = getPaginationData({
      items: items.map(this.mapToViewModel),
      pageNumber: args.pageNumber,
      pageSize: args.pageSize,
      totalCount,
    });

    return paginationData;
  }

  async getPostById(id: string) {
    const post = await postsCollection.findOne({ _id: new ObjectId(id) });

    return post ? this.mapToViewModel(post) : post;
  }

  async getPostsByBlogId({ blogId, query }: { blogId: string; query: PostsRequestQueryType }) {
    const { sort, skip, limit } = getPaginationParams(query);

    const items = await postsCollection
      .find({ blogId })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await postsCollection.countDocuments({ blogId });

    const paginationData = getPaginationData({
      items: items.map(this.mapToViewModel),
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
    });

    return paginationData;
  }

  private mapToViewModel({ _id, ...restPost }: WithId<PostDBType>): PostViewModelType {
    return {
      id: _id.toString(),
      ...restPost,
    };
  }
}
