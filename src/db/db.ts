import { BlogType } from '../blogs/types/blog';
import { PostType } from '../posts/types/post';

type DBType = {
  blogs: BlogType[];
  posts: PostType[];
};

export const db: DBType = {
  blogs: [],
  posts: [],
};
