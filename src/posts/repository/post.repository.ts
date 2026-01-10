import { Nullable } from '../../core/types';
import { db } from '../../db/db';
import { PostInputModelType, PostType } from '../types/post';

export const postRepository = {
  getPosts: () => {
    return db.posts;
  },
  getPostById: (id: string): Nullable<PostType> => {
    return db.posts.find(post => post.id === id) ?? null;
  },
  createPost: (post: PostInputModelType) => {
    const blog = db.blogs.find(blog => blog.id === post.blogId);

    if (blog) {
      const newPost: PostType = { id: String(db.posts.length + 1), blogName: blog.name, ...post };

      db.posts.push(newPost);

      return newPost;
    }

    return null;
  },
  updatePostById: ({ id, body }: { id: string; body: PostInputModelType }) => {
    const postIndex = db.posts.findIndex(post => post.id === id);

    if (postIndex !== -1) {
      db.posts = db.posts.map((post, index) => (index === postIndex ? { ...post, ...body } : post));

      return true;
    }

    return false;
  },
  deletePostById: (id: string) => {
    const postIndex = db.posts.findIndex(post => post.id === id);

    if (postIndex !== -1) {
      db.posts = db.posts.filter((_, index) => index !== postIndex);

      return true;
    }

    return false;
  },
};
