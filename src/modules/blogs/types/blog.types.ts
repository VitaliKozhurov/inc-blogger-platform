import { HydratedDocument } from 'mongoose';

export type BlogType = {
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: Date;
};

export type BlogDocument = HydratedDocument<BlogType>;
