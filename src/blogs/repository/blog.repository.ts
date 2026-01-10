import { db } from '../../db/db';
import { BlogInputModelType } from '../types/blog';

export const blogRepository = {
  getBlogs: () => {
    return db.blogs;
  },
  getBlogById: (id: string) => {
    return db.blogs.find(p => p.id === id) ?? null;
  },
  createBlog: (blog: BlogInputModelType) => {
    const newBlog = { id: String(db.blogs.length + 1), ...blog };

    db.blogs.push(newBlog);

    return newBlog;
  },
  updateBlogById: ({ id, body }: { id: string; body: BlogInputModelType }) => {
    const foundBlog = db.blogs.find(blog => blog.id === id);

    if (foundBlog) {
      db.blogs = db.blogs.map(blog => (blog.id === foundBlog.id ? { ...blog, ...body } : blog));

      return true;
    }

    return false;
  },
  deleteBlogById: (id: string) => {
    const foundBlog = db.blogs.find(blog => blog.id === id);

    if (foundBlog) {
      db.blogs = db.blogs.filter(blog => blog.id !== foundBlog.id);

      return true;
    }

    return false;
  },
};
