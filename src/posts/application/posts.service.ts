import { blogsRepository } from '../../blogs/repository';
import { postsRepository } from '../repository';
import { CreatePostDTOType, CreatePostInputType, UpdatePostInputType } from '../types';

export const postsService = {
  createPost: async (postData: CreatePostInputType) => {
    // TODO что тут лучше дергать репозиторий или сервис ?

    const { name } = await blogRepository.getBlogByIdOrFail(postData.blogId);

    const newPost: CreatePostDTOType = {
      ...postData,
      blogName: name,
      createdAt: new Date().toISOString(),
    };

    const postId = await postRepository.createPost(newPost);

    return postId;
  },
  updatePostById: async ({ id, postData }: { id: string; postData: UpdatePostInputType }) => {
    return postRepository.updatePostById({ id, postData });
  },
  deletePostById: async (blogId: string) => {
    return postRepository.deletePostById(blogId);
  },
  createPostForBlogById: async ({
    blogId,
    postData,
  }: {
    blogId: string;
    postData: CreatePostInputType;
  }) => {
    const { name } = await blogsRepository.getBlogByIdOrFail(blogId);

    const newPost: CreatePostDTOType = {
      ...postData,
      blogName: name,
      createdAt: new Date().toISOString(),
    };

    const postId = await postsRepository.createPost(newPost);

    return postId;
  },
};
