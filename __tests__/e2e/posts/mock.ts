import { PostInputDTO } from '../../../src/posts/types/post';

export const mockPost: Omit<PostInputDTO, 'blogId'> = {
  title: 'New post',
  shortDescription: 'Short description',
  content: 'Post content',
};

export const mockUpdatedPost: Omit<PostInputDTO, 'blogId'> = {
  title: 'Updated post',
  shortDescription: 'Updated short description',
  content: 'Updated content',
};
