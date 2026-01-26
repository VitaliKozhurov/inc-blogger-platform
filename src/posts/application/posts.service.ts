import { blogsQWRepository } from '../../blogs/repository';
import { HTTP_STATUSES } from '../../core/types';
import { postsRepository } from '../repository';
import { CreatePostInputType, PostDBType, UpdatePostInputType } from '../types';

export const postsService = {
  createPost: async (postData: CreatePostInputType) => {
    const blog = await blogsQWRepository.getBlogById(postData.blogId);

    if (!blog) {
      return {
        data: null,
        status: HTTP_STATUSES.NOT_FOUND,
        extensions: [{ field: null, message: 'Blog not found' }],
        errorMessage: 'Blog not found',
      };
    }

    const newPost: PostDBType = {
      ...postData,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    const id = await postsRepository.createPost(newPost);

    return {
      data: { id },
      status: HTTP_STATUSES.OK,
      extensions: [],
    };
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
    const blog = await blogsQWRepository.getBlogById(blogId);

    if (!blog) {
      return {
        data: null,
        status: HTTP_STATUSES.NOT_FOUND,
        extensions: [{ field: null, message: 'Blog not found' }],
        errorMessage: 'Blog not found',
      };
    }

    const newPost: PostDBType = {
      ...postData,
      blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    const id = await postsRepository.createPost(newPost);

    return {
      data: { id },
      status: HTTP_STATUSES.OK,
      extensions: [],
    };
  },
};
