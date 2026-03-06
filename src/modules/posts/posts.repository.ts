import { injectable } from 'inversify';
import { ObjectId } from 'mongodb';

import { PostModel } from './post.model';
import { PostDocument } from './types/post.types';

@injectable()
export class PostsRepository {
  async getPostById(id: string) {
    return PostModel.findById(id);
  }

  async deletePostById(id: string) {
    const { deletedCount } = await PostModel.deleteOne({ _id: new ObjectId(id) });

    return deletedCount > 0;
  }

  async savePost(postDocument: PostDocument) {
    await postDocument.save();
  }
}
