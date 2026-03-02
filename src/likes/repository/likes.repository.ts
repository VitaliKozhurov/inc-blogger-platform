import { injectable } from 'inversify';

import { LikeDocument, LikeModel } from '../model';

@injectable()
export class LikesRepository {
  async findByFilter({ authorId, parentId }: { authorId: string; parentId: string }) {
    return LikeModel.findOne({ parentId, authorId });
  }

  async createBlog(blog: Omit<BlogType, '_id'>) {
    const { id } = await BlogModel.create(blog);

    return id;
  }

  async save(likeDocument: LikeDocument) {
    await likeDocument.save();
  }
}
