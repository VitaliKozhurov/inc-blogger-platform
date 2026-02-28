import { injectable } from 'inversify';
import { ObjectId } from 'mongodb';

import { PostDocument, PostModel, PostType } from '../model';

@injectable()
export class PostsRepository {
  async getPostById(id: string) {
    return PostModel.findById(id);
  }

  async createPost(post: Omit<PostType, '_id'>) {
    const { id } = await PostModel.create(post);

    return id;
  }

  async deletePostById(id: string) {
    const { deletedCount } = await PostModel.deleteOne({ _id: new ObjectId(id) });

    return deletedCount > 0;
  }

  async savePost(postDocument: PostDocument) {
    await postDocument.save();
  }
}
