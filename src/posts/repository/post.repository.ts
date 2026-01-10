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
    const foundPost = db.posts.find(post => post.id === id);

    if (foundPost) {
      db.posts = db.posts.map(post => (post.id === foundPost.id ? { ...post, ...body } : post));

      return true;
    }

    return false;
  },
  deletePostById: (id: string) => {
    const foundPost = db.posts.find(post => post.id === id);

    if (foundPost) {
      db.posts = db.posts.filter(post => post.id !== foundPost.id);

      return true;
    }

    return false;
  },
};
