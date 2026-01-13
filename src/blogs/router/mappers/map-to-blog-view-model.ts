import { WithId } from 'mongodb';

import { BlogEntityType, BlogViewModelType } from '../../types/blog';

export const mapToBlogViewModel = (blog: WithId<BlogEntityType>): BlogViewModelType => {
  const { _id, ...restBlog } = blog;

  return { id: _id.toString(), ...restBlog };
};
