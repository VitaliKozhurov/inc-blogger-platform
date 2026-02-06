import { Filter, ObjectId, WithId } from 'mongodb';

import { Nullable, ResponseWithPaginationType } from '../../core/types';
import { getPaginationData, getPaginationParams } from '../../core/utils';
import { blogsCollection } from '../../db';
import { BlogDBType, BlogFields, BlogsRequestQueryType, BlogViewModelType } from '../types';

export const blogsQWRepository = {
  async getBlogs(
    args: BlogsRequestQueryType
  ): Promise<ResponseWithPaginationType<BlogViewModelType>> {
    const { searchNameTerm, ...restArgs } = args;

    const filter: Filter<BlogDBType> = {};

    if (searchNameTerm) {
      filter[BlogFields.NAME] = {
        $regex: searchNameTerm,
        $options: 'i',
      };
    }

    const { sort, skip, limit } = getPaginationParams(restArgs);

    const items = await blogsCollection.find(filter).sort(sort).skip(skip).limit(limit).toArray();
    const totalCount = await blogsCollection.countDocuments(filter);

    const paginationData = getPaginationData({
      items: items.map(this._mapToViewModel),
      pageNumber: restArgs.pageNumber,
      pageSize: restArgs.pageSize,
      totalCount,
    });

    return paginationData;
  },

  async getBlogById(id: string): Promise<Nullable<BlogViewModelType>> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

    return blog ? this._mapToViewModel(blog) : blog;
  },

  _mapToViewModel({ _id, ...restBlog }: WithId<BlogDBType>) {
    return { id: _id.toString(), ...restBlog };
  },
};
