import { WithId } from 'mongodb';

import { PostViewModelType } from '../../types';
import { PostEntityType } from '../../types/post';

export const mapToPostViewModel = (post: WithId<PostEntityType>): PostViewModelType => {
  const { _id, ...restPost } = post;

  return { id: _id.toString(), ...restPost };
};
