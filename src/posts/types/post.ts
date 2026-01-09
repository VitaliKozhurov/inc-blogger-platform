export type PostType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
};

export type CreatePostInputType = Omit<PostType, 'id'>;
export type UpdatePostInputType = Omit<PostType, 'id' | 'blogName'>;
