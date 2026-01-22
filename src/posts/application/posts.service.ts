import { blogsQWRepository } from '../../blogs/repository';
import { postsRepository } from '../repository';
import { CreatePostInputType, PostDBType, UpdatePostInputType } from '../types';

export const postsService = {
  createPost: async (postData: CreatePostInputType) => {
    const { name } = await blogsQWRepository.getBlogByIdOrFail(postData.blogId);

    const newPost: PostDBType = {
      ...postData,
      blogName: name,
      createdAt: new Date().toISOString(),
    };

    const postId = await postsRepository.createPost(newPost);

    return postId;
  },

  updatePostById: async ({ id, postData }: { id: string; postData: UpdatePostInputType }) => {
    return postsRepository.updatePostById({ id, postData });
  },

  deletePostById: async (blogId: string) => {
    return postsRepository.deletePostById(blogId);
  },

  createPostForBlogById: async ({
    blogId,
    postData,
  }: {
    blogId: string;
    postData: Omit<CreatePostInputType, 'blogId'>;
  }) => {
    const { name } = await blogsQWRepository.getBlogByIdOrFail(blogId);

    const newPost: PostDBType = {
      ...postData,
      blogId,
      blogName: name,
      createdAt: new Date().toISOString(),
    };

    const postId = await postsRepository.createPost(newPost);

    return postId;
  },
};
