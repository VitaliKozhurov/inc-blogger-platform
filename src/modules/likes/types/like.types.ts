import { HydratedDocument } from 'mongoose';

import { LikeStatus } from './like-status.types';

export type LikeType = {
  authorId: string;
  parentId: string;
  createdAt: Date;
  status: LikeStatus;
};

export type LikeDocument = HydratedDocument<LikeType>;
