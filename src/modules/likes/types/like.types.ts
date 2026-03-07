import { HydratedDocument } from 'mongoose';

import { CreateLikeDTO } from '../dto/create-like.dto';

import { LikeStatus } from './like-status.types';

export type LikeType = {
  authorId: string;
  parentId: string;
  createdAt: Date;
  status: LikeStatus;
};

export type LikeDocument = HydratedDocument<LikeType, LikeMethodsType>;

export type LikeStaticMethodsType = {
  createLikeInstance(args: CreateLikeDTO): Promise<LikeDocument>;
};

export type LikeMethodsType = {
  updateLikeStatus(likeStatus: LikeStatus): LikeDocument;
};
