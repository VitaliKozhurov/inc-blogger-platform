import { Filter, ObjectId, WithId } from 'mongodb';

import { RepositoryNotFoundError } from '../../core/errors';
import { getPaginationParams } from '../../core/utils';
import { blogCollection } from '../../db';
import { BlogEntityType, BlogFields, BlogRequestQueryType } from '../types';

export const blogsQWRepository = {
  getBlogs: async (
    args: BlogRequestQueryType
  ): Promise<{ items: WithId<BlogEntityType>[]; totalCount: number }> => {
    const { searchNameTerm, ...restArgs } = args;

    const filter: Filter<BlogEntityType> = {};

    if (searchNameTerm) {
      filter[BlogFields.NAME] = {
        $regex: searchNameTerm,
        $options: 'i',
      };
    }

    const { sort, skip, limit } = getPaginationParams(restArgs);

    const items = await blogCollection.find(filter).sort(sort).skip(skip).limit(limit).toArray();
    const totalCount = await blogCollection.countDocuments(filter);

    return { items, totalCount };
  },
  getBlogByIdOrFail: async (id: string): Promise<WithId<BlogEntityType>> => {
    const blog = await blogCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      throw new RepositoryNotFoundError('Blog not exist');
    }

    return blog;
  },
};
