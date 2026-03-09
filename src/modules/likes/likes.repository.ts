import { injectable } from 'inversify';

import { LikeModel } from './like.model';
import { LikeDocument } from './types/like.types';

@injectable()
export class LikesRepository {
  async findByFilter({ authorId, parentId }: { authorId: string; parentId: string }) {
    return LikeModel.findOne({ parentId, authorId });
  }

  async saveLike(likeDocument: LikeDocument) {
    await likeDocument.save();
  }
}
