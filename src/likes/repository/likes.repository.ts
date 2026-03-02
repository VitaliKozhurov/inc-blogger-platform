import { injectable } from 'inversify';

import { LikeDocument, LikeModel, LikeType } from '../model';

@injectable()
export class LikesRepository {
  async findByFilter({ authorId, parentId }: { authorId: string; parentId: string }) {
    return LikeModel.findOne({ parentId, authorId });
  }

  async createLike(blog: Omit<LikeType, '_id'>) {
    const { id } = await LikeModel.create(blog);

    return id;
  }

  async save(likeDocument: LikeDocument) {
    await likeDocument.save();
  }
}
