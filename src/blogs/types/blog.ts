export type BlogEntityType = {
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: string;
};
export type BlogViewModelType = { id: string } & BlogEntityType;
export type BlogInputDTO = Pick<BlogEntityType, 'name' | 'description' | 'websiteUrl'>;
export type CreateBlogDTOType = BlogEntityType;

export type UpdateBlogDTOType = Pick<BlogEntityType, 'name' | 'description' | 'websiteUrl'>;

export enum BlogFields {
  ID = 'id',
  NAME = 'name',
  DESCRIPTION = 'description',
  WEBSITE_URL = 'websiteUrl',
}
