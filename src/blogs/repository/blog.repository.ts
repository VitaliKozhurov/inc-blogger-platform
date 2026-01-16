import { Filter, ObjectId, WithId } from 'mongodb';

import { RepositoryNotFoundError } from '../../core/errors';
import { getPaginationParams } from '../../core/utils';
import { blogCollection } from '../../db';
import { BlogFields, BlogRequestQueryType, CreateBlogDTOType, UpdateBlogDTOType } from '../types';
import { BlogEntityType } from '../types/blog';

export const blogRepository = {
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
  createBlog: async (blogData: CreateBlogDTOType): Promise<string> => {
    const { insertedId } = await blogCollection.insertOne(blogData);

    return insertedId.toString();
  },
  updateBlogById: async (args: { id: string; blogData: UpdateBlogDTOType }): Promise<void> => {
    const { id, blogData } = args;

    const { modifiedCount } = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: blogData }
    );

    if (modifiedCount < 1) {
      throw new RepositoryNotFoundError('Blog not exist');
    }

    return;
  },
  deleteBlogById: async (id: string): Promise<void> => {
    const { deletedCount } = await blogCollection.deleteOne({ _id: new ObjectId(id) });

    if (deletedCount < 1) {
      throw new RepositoryNotFoundError('Blog not exist');
    }

    return;
  },
};
