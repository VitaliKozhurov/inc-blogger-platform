export type BlogType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogInputType = Omit<BlogType, 'id'>;

export enum BlogFields {
  ID = 'id',
  NAME = 'name',
  DESCRIPTION = 'description',
  WEBSITE_URL = 'websiteUrl',
}
