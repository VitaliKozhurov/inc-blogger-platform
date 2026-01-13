import { ObjectId, WithId } from 'mongodb';

import { Nullable } from '../../core/types';
import { blogCollection } from '../../db';
import { BlogEntityType, CreateBlogDTOType, UpdateBlogDTOType } from '../types/blog';

export const blogRepository = {
  getBlogs: async (): Promise<WithId<BlogEntityType>[]> => {
    return blogCollection.find().toArray();
  },
  getBlogById: async (id: string): Promise<Nullable<WithId<BlogEntityType>>> => {
    return blogCollection.findOne({ _id: new ObjectId(id) });
  },
  createBlog: async (newBlog: CreateBlogDTOType): Promise<WithId<BlogEntityType>> => {
    const { insertedId } = await blogCollection.insertOne(newBlog);

    return { _id: insertedId, ...newBlog };
  },
  updateBlogById: async (args: { id: string; body: UpdateBlogDTOType }): Promise<boolean> => {
    const { id, body } = args;

    const { modifiedCount } = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: body,
      }
    );

    return modifiedCount === 1 ? true : false;
  },
  deleteBlogById: async (id: string): Promise<boolean> => {
    const { deletedCount } = await blogCollection.deleteOne({ _id: new ObjectId(id) });

    return deletedCount === 1 ? true : false;
  },
};
