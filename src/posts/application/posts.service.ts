import { blogsRepository } from '../../blogs/repository';
import { postsRepository } from '../repository';
import { CreatePostInputType, PostDBType, UpdatePostInputType } from '../types';
import { postsObjectResult } from '../utils/posts-object-result';

export const postsService = {
  createPost: async (postData: CreatePostInputType) => {
    const blog = await blogsRepository.getBlogById(postData.blogId);

    if (!blog) {
      return postsObjectResult.notFoundBlog();
    }

    const newPost: PostDBType = {
      ...postData,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    const id = await postsRepository.createPost(newPost);

    return postsObjectResult.success({ id });
  },

  updatePostById: async ({ id, postData }: { id: string; postData: UpdatePostInputType }) => {
    const isUpdated = await postsRepository.updatePostById({ id, postData });

    if (isUpdated) {
      return postsObjectResult.success();
    }

    return postsObjectResult.notFoundPost();
  },

  deletePostById: async (blogId: string) => {
    const isDeleted = await postsRepository.deletePostById(blogId);

    if (isDeleted) {
      return postsObjectResult.success();
    }

    return postsObjectResult.notFoundPost();
  },
};
