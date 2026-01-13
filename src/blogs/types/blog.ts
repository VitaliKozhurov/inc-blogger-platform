export type BlogEntityType = {
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: Date;
};

export type CreateBlogDTOType = BlogEntityType;

export type UpdateBlogDTOType = Pick<BlogEntityType, 'name' | 'description' | 'websiteUrl'>;

export enum BlogFields {
  ID = 'id',
  NAME = 'name',
  DESCRIPTION = 'description',
  WEBSITE_URL = 'websiteUrl',
}
