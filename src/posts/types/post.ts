export type PostType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
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
