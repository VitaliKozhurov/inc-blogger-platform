import { injectable } from 'inversify';
import { ObjectId } from 'mongodb';

import { BlogDocument, BlogModel, BlogType } from '../model';

@injectable()
export class BlogsRepository {
  async getBlogById(id: string) {
    return BlogModel.findById(id);
  }

  async createBlog(blog: Omit<BlogType, '_id'>) {
    const { id } = await BlogModel.create(blog);

    return id;
  }

  async deleteBlogById(id: string) {
    const { deletedCount } = await BlogModel.deleteOne({ _id: new ObjectId(id) });

    return deletedCount > 0;
  }

  async saveBlog(blogDocument: BlogDocument) {
    await blogDocument.save();
  }
}
