export type BlogType = {
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: Date;
};

export type BlogInputModelType = Omit<BlogType, 'id'>;

export enum BlogFields {
  ID = 'id',
  NAME = 'name',
  DESCRIPTION = 'description',
  WEBSITE_URL = 'websiteUrl',
}
