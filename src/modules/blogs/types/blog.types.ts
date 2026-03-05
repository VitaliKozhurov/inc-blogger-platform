import { HydratedDocument } from 'mongoose';

import { CreateBlogDTO } from '../dto/create-blog.dto';
import { UpdateBlogDTO } from '../dto/update-blog.dto';

export type BlogType = {
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: Date;
};

export type BlogDocument = HydratedDocument<BlogType, BlogMethodsType>;

export type BlogStaticMethodsType = {
  createBlogInstance(args: CreateBlogDTO): Promise<BlogDocument>;
};

export type BlogMethodsType = {
  updateBlog(args: UpdateBlogDTO): BlogDocument;
};
