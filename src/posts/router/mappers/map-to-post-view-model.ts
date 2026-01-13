import { WithId } from 'mongodb';

import { PostEntityType } from '../../types/post';

export const mapToPostViewModel = (post: WithId<PostEntityType>) => {
  const { _id, ...restPost } = post;

  return { id: _id.toString(), ...restPost };
};
