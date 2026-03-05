import { injectable } from 'inversify';
import { ObjectId } from 'mongodb';

import { BlogModel } from './blog.model';
import { BlogDocument } from './types/blog.types';

@injectable()
export class BlogsRepository {
  async getBlogById(id: string) {
    return BlogModel.findById(id).exec();
  }

  async deleteBlogById(id: string) {
    const { deletedCount } = await BlogModel.deleteOne({ _id: new ObjectId(id) }).exec();

    return deletedCount > 0;
  }

  async saveBlog(blogDocument: BlogDocument) {
    await blogDocument.save();
  }
}
