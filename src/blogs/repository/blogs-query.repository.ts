import { injectable } from 'inversify';
import { QueryFilter } from 'mongoose';

import { Nullable, ResponseWithPaginationType } from '../../core/types';
import { getPaginationData, getPaginationParams } from '../../core/utils';
import { BlogModel, BlogType } from '../model';
import { BlogFields, BlogsRequestQueryType, BlogViewModelType } from '../types';

@injectable()
export class BlogsQueryRepository {
  async getBlogById(id: string): Promise<Nullable<BlogViewModelType>> {
    const blog = await BlogModel.findById(id);

    return blog ? this.mapToViewModel(blog) : blog;
  }

  async getBlogs(
    args: BlogsRequestQueryType
  ): Promise<ResponseWithPaginationType<BlogViewModelType>> {
    const { searchNameTerm, ...restArgs } = args;

    const filter: QueryFilter<BlogType> = {};

    if (searchNameTerm) {
      filter[BlogFields.NAME] = {
        $regex: searchNameTerm,
        $options: 'i',
      };
    }

    const { sort, skip, limit } = getPaginationParams(restArgs);

    const [items, totalCount] = await Promise.all([
      BlogModel.find(filter).lean().sort(sort).skip(skip).limit(limit).exec(),
      BlogModel.countDocuments(filter).exec(),
    ]);

    const paginationData = getPaginationData({
      items: items.map(this.mapToViewModel),
      pageNumber: restArgs.pageNumber,
      pageSize: restArgs.pageSize,
      totalCount,
    });

    return paginationData;
  }

  private mapToViewModel({ _id, createdAt, ...restBlog }: BlogType): BlogViewModelType {
    return {
      id: _id.toString(),
      createdAt: createdAt.toISOString(),
      ...restBlog,
    };
  }
}
