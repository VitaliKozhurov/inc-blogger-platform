import { ObjectId, WithId } from 'mongodb';

import { RepositoryNotFoundError } from '../../core/errors';
import { getPaginationParams } from '../../core/utils';
import { postCollection } from '../../db';
import {
  CreatePostDTOType,
  PostEntityType,
  PostRequestQueryType,
  UpdatePostDTOType,
} from '../types';

export const postRepository = {
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

  createPost: async (post: CreatePostDTOType): Promise<string> => {
    const { insertedId } = await postCollection.insertOne(post);

    return insertedId.toString();
  },

  updatePostById: async (args: { id: string; postData: UpdatePostDTOType }): Promise<void> => {
    const { id, postData } = args;

    const { modifiedCount } = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: postData }
    );

    if (modifiedCount < 1) {
      throw new RepositoryNotFoundError('Post not exist');
    }

    return;
  },

  deletePostById: async (id: string): Promise<void> => {
    const { deletedCount } = await postCollection.deleteOne({ _id: new ObjectId(id) });

    if (deletedCount < 1) {
      throw new RepositoryNotFoundError('Post not exist');
    }

    return;
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
