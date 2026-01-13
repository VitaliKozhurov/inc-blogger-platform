import { WithId } from 'mongodb';

import { PostEntityType, PostViewModelType } from '../../types/post';

export const mapToPostViewModel = (post: WithId<PostEntityType>): PostViewModelType => {
  const { _id, ...restPost } = post;

  return { id: _id.toString(), ...restPost };
};
