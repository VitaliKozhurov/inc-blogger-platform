import { db } from '../../db/db';
import { BlogInputType } from '../types/blog';

export const blogRepository = {
  getBlogs: () => {
    return db.blogs;
  },
  getBlogById: (id: string) => {
    return db.blogs.find(p => p.id === id) ?? null;
  },
  createBlog: (blog: BlogInputType) => {
    const newBlog = { id: String(db.blogs.length + 1), ...blog };

    db.blogs.push(newBlog);

    return newBlog;
  },
  updateBlogById: ({ id, body }: { id: string; body: BlogInputType }) => {
    const blogIndex = db.blogs.findIndex(blog => blog.id === id);

    if (blogIndex !== -1) {
      db.blogs = db.blogs.map((blog, index) => (index === blogIndex ? { ...blog, ...body } : blog));

      return true;
    }

    return false;
  },
  deleteBlogById: (id: string) => {
    const blogIndex = db.blogs.findIndex(blog => blog.id === id);

    if (blogIndex !== -1) {
      db.blogs = db.blogs.filter((_, index) => index !== blogIndex);

      return true;
    }

    return false;
  },
};
