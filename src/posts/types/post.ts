export type PostType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
};

export type PostInputModelType = Omit<PostType, 'id' | 'blogName'>;

export enum PostFields {
  ID = 'id',
  TITLE = 'title',
  SHORT_DESCRIPTION = 'shortDescription',
  CONTENT = 'content',
  BLOG_ID = 'blogId',
  BLOG_NAME = 'blogName',
}
