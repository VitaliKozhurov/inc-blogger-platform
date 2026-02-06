import { ObjectId, WithId } from 'mongodb';

import { Nullable } from '../../core/types';
import { blogsCollection } from '../../db';
import { BlogDBType, UpdateBlogInputType } from '../types';

export const blogsRepository = {
  createBlog: async (blogData: BlogDBType): Promise<string> => {
    const { insertedId } = await blogsCollection.insertOne(blogData);

    return insertedId.toString();
  },

  updateBlogById: async (args: { id: string; blogData: UpdateBlogInputType }): Promise<boolean> => {
    const { id, blogData } = args;

    const { modifiedCount } = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: blogData }
    );

    return modifiedCount > 0;
  },

  deleteBlogById: async (id: string): Promise<boolean> => {
    const { deletedCount } = await blogsCollection.deleteOne({ _id: new ObjectId(id) });

    return deletedCount > 0;
  },

  async getBlogById(id: string): Promise<Nullable<WithId<BlogDBType>>> {
    return blogsCollection.findOne({ _id: new ObjectId(id) });
  },
};
