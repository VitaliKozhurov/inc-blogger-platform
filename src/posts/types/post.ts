export type PostEntityType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
};

export type CreatePostDTOType = Omit<PostEntityType, 'blogName'>;

export type UpdatePostDTOType = Pick<
  PostEntityType,
  'title' | 'shortDescription' | 'content' | 'blogId'
>;

export enum PostFields {
  ID = 'id',
  TITLE = 'title',
  SHORT_DESCRIPTION = 'shortDescription',
  CONTENT = 'content',
  BLOG_ID = 'blogId',
  BLOG_NAME = 'blogName',
}
