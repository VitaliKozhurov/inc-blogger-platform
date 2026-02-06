import { CreatePostInputType, UpdatePostInputType } from '../../../src/posts/types';

export const mockPost: Omit<CreatePostInputType, 'blogId'> = {
  title: 'New post',
  shortDescription: 'Short description',
  content: 'Post content',
};

export const mockUpdatedPost: Omit<UpdatePostInputType, 'blogId'> = {
  title: 'Updated post',
  shortDescription: 'Updated short description',
  content: 'Updated content',
};
