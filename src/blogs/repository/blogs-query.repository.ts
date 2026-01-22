import { Filter, ObjectId, WithId } from 'mongodb';

import { RepositoryNotFoundError } from '../../core/errors';
import { ResponseWithPaginationType } from '../../core/types';
import { getPaginationData, getPaginationParams } from '../../core/utils';
import { blogCollection } from '../../db';
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

    const items = await blogCollection.find(filter).sort(sort).skip(skip).limit(limit).toArray();
    const totalCount = await blogCollection.countDocuments(filter);

    const paginationData = getPaginationData({
      items: items.map(this._mapToViewModel),
      pageNumber: restArgs.pageNumber,
      pageSize: restArgs.pageSize,
      totalCount,
    });

    return paginationData;
  },

  async getBlogByIdOrFail(id: string): Promise<BlogViewModelType> {
    const blog = await blogCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      throw new RepositoryNotFoundError('Blog not exist');
    }

    return this._mapToViewModel(blog);
  },

  _mapToViewModel({ _id, ...restBlog }: WithId<BlogDBType>) {
    return { id: _id.toString(), ...restBlog };
  },
};
