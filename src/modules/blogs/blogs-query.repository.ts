import { injectable } from 'inversify';
import { QueryFilter, Types } from 'mongoose';

import { getPaginationData, getPaginationParams } from '../../core/utils';

import { BlogModel } from './blog.model';
import { BlogViewModelDTO } from './dto/blog-view-model.dto';
import { BlogsRequestQueryDTO } from './dto/blogs-request-query.dto';
import { BlogFields } from './types/blog-fields.types';
import { BlogType } from './types/blog.types';

type BlogMapInputType = { _id: Types.ObjectId } & BlogType;

@injectable()
export class BlogsQueryRepository {
  async getBlogById(id: string) {
    const blog = await BlogModel.findById(id).lean().exec();

    return blog ? this.mapToViewModel(blog) : blog;
  }

  async getBlogs(args: BlogsRequestQueryDTO) {
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

  private mapToViewModel({ _id, createdAt, ...restBlog }: BlogMapInputType): BlogViewModelDTO {
    return {
      id: _id.toString(),
      createdAt: createdAt.toISOString(),
      ...restBlog,
    };
  }
}
