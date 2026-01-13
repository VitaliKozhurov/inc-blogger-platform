export type BlogEntityType = {
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: string;
};
export type BlogViewModelType = { id: string } & BlogEntityType;
export type BlogInputDTO = Omit<BlogEntityType, 'isMembership' | 'createdAt'>;
export type CreateBlogDTOType = BlogEntityType;
export type UpdateBlogDTOType = Omit<BlogEntityType, 'isMembership' | 'createdAt'>;

export enum BlogFields {
  ID = 'id',
  NAME = 'name',
  DESCRIPTION = 'description',
  WEBSITE_URL = 'websiteUrl',
}
