import { CreatePostDTO } from '../../../src/modules/posts/dto/create-post.dto';
import { UpdatePostDTO } from '../../../src/modules/posts/dto/update-post.dto';

export const mockPost: Omit<CreatePostDTO, 'blogId'> = {
  title: 'New post',
  shortDescription: 'Short description',
  content: 'Post content',
};

export const mockUpdatedPost: Omit<UpdatePostDTO, 'blogId'> = {
  title: 'Updated post',
  shortDescription: 'Updated short description',
  content: 'Updated content',
};
