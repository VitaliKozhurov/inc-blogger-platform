import { ObjectId, WithId } from 'mongodb';

import { RepositoryNotFoundError } from '../../core/errors';
import { getPaginationParams } from '../../core/utils';
import { postCollection } from '../../db';
import { PostEntityType, PostRequestQueryType } from '../types';

export const postsQWRepository = {
  getPosts: async (
    args: PostRequestQueryType
  ): Promise<{ items: WithId<PostEntityType>[]; totalCount: number }> => {
    const { sort, limit, skip } = getPaginationParams(args);

    const items = await postCollection.find({}).sort(sort).skip(skip).limit(limit).toArray();

    const totalCount = await postCollection.countDocuments();

    return { items, totalCount };
  },

  getPostByIdOrFail: async (id: string): Promise<WithId<PostEntityType>> => {
    const post = await postCollection.findOne({ _id: new ObjectId(id) });

    if (!post) {
      throw new RepositoryNotFoundError('Post not exist');
    }

    return post;
  },

  getPostsByBlogId: async ({
    blogId,
    query,
  }: {
    blogId: string;
    query: PostRequestQueryType;
  }): Promise<{ items: WithId<PostEntityType>[]; totalCount: number }> => {
    const { sort, skip, limit } = getPaginationParams(query);

    const items = await postCollection
      .find({ blogId })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await postCollection.countDocuments({ blogId });

    return { items, totalCount };
  },
};
