import { ObjectId } from 'mongodb';

import { RepositoryNotFoundError } from '../../core/errors';
import { blogCollection } from '../../db';
import { BlogDBType, UpdateBlogInputType } from '../types';

export const blogsRepository = {
  createBlog: async (blogData: BlogDBType): Promise<string> => {
    const { insertedId } = await blogCollection.insertOne(blogData);

    return insertedId.toString();
  },

  updateBlogById: async (args: { id: string; blogData: UpdateBlogInputType }): Promise<void> => {
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
