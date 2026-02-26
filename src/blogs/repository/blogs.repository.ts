import { injectable } from 'inversify';
import { ObjectId } from 'mongodb';

import { blogsCollection } from '../../db';
import { BlogDBType, UpdateBlogInputType } from '../types';

@injectable()
export class BlogsRepository {
  async getBlogById(id: string) {
    return blogsCollection.findOne({ _id: new ObjectId(id) });
  }

  async createBlog(blogData: BlogDBType) {
    const { insertedId } = await blogsCollection.insertOne(blogData);

    return insertedId.toString();
  }

  async updateBlogById(args: { id: string; blogData: UpdateBlogInputType }) {
    const { id, blogData } = args;

    const { modifiedCount } = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: blogData }
    );

    return modifiedCount > 0;
  }

  async deleteBlogById(id: string) {
    const { deletedCount } = await blogsCollection.deleteOne({ _id: new ObjectId(id) });

    return deletedCount > 0;
  }
}
