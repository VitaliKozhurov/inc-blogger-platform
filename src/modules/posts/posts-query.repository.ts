import { injectable } from 'inversify';
import { Types } from 'mongoose';

import { getPaginationParams } from '../../core/utils';
import { LikeModel } from '../likes/like.model';
import { LikeStatus } from '../likes/types/like-status.types';
import { LikeType } from '../likes/types/like.types';

import { getPaginationData } from './../../core/utils/get-pagination-data';
import { PostViewModelDTO } from './dto/post-view-model.dto';
import { PostsRequestQueryDTO } from './dto/posts-request-query.dto';
import { PostModel } from './post.model';
import { PostType } from './types/post.types';

type PostMapInputType = {
  post: { _id: Types.ObjectId } & PostType;
  myStatus: LikeStatus;
  newestLikes: LikeType[];
};

type NewestLikesByPostAggregationResult = {
  _id: string;
  newestLikes: LikeType[];
};

const LIKES_LIMIT_COUNT = 3;

@injectable()
export class PostsQueryRepository {
  async getPostById({ id, userId }: { id: string; userId?: string }) {
    const post = await PostModel.findById(id).lean().exec();

    if (!post) {
      return null;
    }

    const likePromise = userId
      ? LikeModel.findOne({ parentId: id, authorId: userId }).select('status').lean().exec()
      : Promise.resolve(null);

    const newestLikesPromise = LikeModel.find({ parentId: id, status: LikeStatus.Like })
      .sort({ addedLikeDate: -1 })
      .limit(LIKES_LIMIT_COUNT)
      .lean()
      .exec();

    const [like, newestLikes] = await Promise.all([likePromise, newestLikesPromise]);

    const myStatus = like ? like.status : LikeStatus.None;

    return this.mapToViewModel({ post, myStatus, newestLikes });
  }

  async getPosts({ userId, requestArgs }: { userId?: string; requestArgs: PostsRequestQueryDTO }) {
    const { sort, limit, skip } = getPaginationParams(requestArgs);

    const [items, totalCount] = await Promise.all([
      PostModel.find().sort(sort).skip(skip).limit(limit).lean().exec(),
      PostModel.countDocuments().exec(),
    ]);

    const postsIds = items.map(c => c._id.toString());

    if (postsIds.length === 0) {
      return getPaginationData({
        items: [],
        pageNumber: requestArgs.pageNumber,
        pageSize: requestArgs.pageSize,
        totalCount,
      });
    }

    const likesPromise = userId
      ? LikeModel.find({ parentId: { $in: postsIds }, authorId: userId })
          .lean()
          .exec()
      : Promise.resolve([]);

    const newestLikesByPostsPromise = LikeModel.aggregate<NewestLikesByPostAggregationResult>([
      {
        $match: {
          parentId: { $in: postsIds },
          status: LikeStatus.Like,
        },
      },
      {
        $group: {
          _id: '$parentId',
          newestLikes: {
            $topN: {
              n: LIKES_LIMIT_COUNT,
              sortBy: { addedLikeDate: -1 },
              output: {
                addedLikeDate: '$addedLikeDate',
                authorId: '$authorId',
                login: '$login',
              },
            },
          },
        },
      },
    ]);

    const [likes, newestLikesByPosts] = await Promise.all([
      likesPromise,
      newestLikesByPostsPromise,
    ]);

    const likesMap = new Map(likes.map(like => [like.parentId, like.status]));

    const newestLikesMap = new Map(newestLikesByPosts.map(item => [item._id, item.newestLikes]));

    const paginationData = getPaginationData({
      items: items.map(post => {
        const likeStatus = likesMap.get(post._id.toString());
        const newestLikes = newestLikesMap.get(post._id.toString()) ?? [];
        const myStatus = likeStatus ? likeStatus : LikeStatus.None;

        return this.mapToViewModel({ post, myStatus, newestLikes });
      }),
      pageNumber: requestArgs.pageNumber,
      pageSize: requestArgs.pageSize,
      totalCount,
    });

    return paginationData;
  }

  async getPostsByBlogId({ blogId, query }: { blogId: string; query: PostsRequestQueryDTO }) {
    const { sort, skip, limit } = getPaginationParams(query);

    const [items, totalCount] = await Promise.all([
      PostModel.find({ blogId }).lean().sort(sort).skip(skip).limit(limit),
      PostModel.countDocuments({ blogId }),
    ]);

    const paginationData = getPaginationData({
      items: items.map(this.mapToViewModel),
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
    });

    return paginationData;
  }

  private mapToViewModel({ post, myStatus, newestLikes }: PostMapInputType): PostViewModelDTO {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt.toISOString(),
      extendedLikesInfo: {
        likesCount: post.extendedLikesInfo.likesCount,
        dislikesCount: post.extendedLikesInfo.dislikesCount,
        myStatus,
        newestLikes: newestLikes.map(l => ({
          addedAt: l.addedLikeDate?.toISOString() ?? '',
          userId: l.authorId,
          login: l.login,
        })),
      },
    };
  }
}
