import { Nullable } from '../../core/types';
import { db } from '../../db/db';
import { CreatePostInputType, PostType, UpdatePostInputType } from '../types/post';

export const postRepository = {
  getPosts: () => {
    return db.posts;
  },
  getPostById: (id: string): Nullable<PostType> => {
    return db.posts.find(p => p.id === id) ?? null;
  },
  createPost: (post: CreatePostInputType) => {
    const newPost = { id: String(db.posts.length + 1), ...post };

    db.posts.push(newPost);

    return newPost;
  },
  updatePostById: ({ id, body }: { id: string; body: UpdatePostInputType }) => {
    const postIndex = db.posts.findIndex(p => p.id === id);

    if (postIndex !== -1) {
      db.posts = db.posts.map((post, index) => (index === postIndex ? { ...post, ...body } : post));

      return true;
    }

    return false;
  },
  deletePostById: (id: string) => {
    const postIndex = db.posts.findIndex(p => p.id === id);

    if (postIndex !== -1) {
      db.posts = db.posts.filter((_, index) => index !== postIndex);

      return true;
    }

    return false;
  },
};
