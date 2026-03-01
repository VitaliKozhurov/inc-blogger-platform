import { LikeModel, LikeStatus } from '../model/like.model';

export class LikeRepository {
  async getLikeById(id: string) {
    return LikeModel.findById(id).exec();
  }

  async getLikesByParentId(parentId: string) {
    return LikeModel.find({ parentId }).exec();
  }

  async getLikesCountByParentId({
    parentId,
    likeStatus,
  }: {
    parentId: string;
    likeStatus: LikeStatus.Like | LikeStatus.Dislike;
  }) {
    return LikeModel.countDocuments({ parentId, status: likeStatus }).exec();
  }
}
