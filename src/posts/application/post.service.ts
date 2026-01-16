import { blogRepository } from '../../blogs/repository';
import { postRepository } from '../repository';
import {
  CreatePostDTOType,
  CreatePostInputType,
  PostRequestQueryType,
  UpdatePostInputType,
} from '../types';

export const postService = {
  getPosts: async (args: PostRequestQueryType) => {
    const result = await postRepository.getPosts(args);

    return result;
  },

  getPostById: async (id: string) => {
    return postRepository.getPostByIdOrFail(id);
  },

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
  getPostByBlogId: async ({ blogId, query }: { blogId: string; query: PostRequestQueryType }) => {
    // TODO это прием чтобы в случае если блога нет сразу выкидывать ошибку и не идти в базу

    await blogRepository.getBlogByIdOrFail(blogId);

    const result = await postRepository.getPostsByBlogId({ blogId, query });

    return result;
  },
  createPostForBlogById: async ({ blogId, postData }: { blogId: string; postData: CreatePostInputType }) => {
    const {name} = await blogRepository.getBlogByIdOrFail(blogId);

    const newPost: CreatePostDTOType = {
      ...postData,
      blogName: name,
      createdAt: new Date().toISOString(),
    };

    const postId = await postRepository.createPost(newPost);

    return postId
  },
};
