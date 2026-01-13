export type PostEntityType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type PostViewModelType = { id: string } & PostEntityType;
export type PostInputDTO = Omit<PostEntityType, 'blogName' | 'createdAt'>;
export type CreatePostDTOType = Omit<PostEntityType, 'blogName'>;
export type UpdatePostDTOType = Omit<PostEntityType, 'blogName' | 'createdAt'>;

export enum PostFields {
  ID = 'id',
  TITLE = 'title',
  SHORT_DESCRIPTION = 'shortDescription',
  CONTENT = 'content',
  BLOG_ID = 'blogId',
  BLOG_NAME = 'blogName',
}
