import { ObjectId, WithId } from 'mongodb';

import { Nullable } from '../../core/types';
import { postCollection, blogCollection } from '../../db';
import { CreatePostDTOType, PostEntityType, UpdatePostDTOType } from '../types/post';

export const postRepository = {
  getPosts: async (): Promise<WithId<PostEntityType>[]> => {
    return postCollection.find().toArray();
  },
  getPostById: async (id: string): Promise<Nullable<WithId<PostEntityType>>> => {
    return postCollection.findOne({ _id: new ObjectId(id) });
  },
  createPost: async (post: CreatePostDTOType): Promise<Nullable<WithId<PostEntityType>>> => {
    const blog = await blogCollection.findOne({ _id: new ObjectId(post.blogId) });

    if (blog) {
      const newPost: PostEntityType = { blogName: blog.name, ...post };

      const { insertedId } = await postCollection.insertOne(newPost);

      return { _id: insertedId, ...newPost };
    }

    return null;
  },
  updatePostById: async (args: { id: string; body: UpdatePostDTOType }): Promise<boolean> => {
    const { id, body } = args;

    const { modifiedCount } = await postCollection.updateOne({ _id: new Object(id) }, body);

    return modifiedCount === 1 ? true : false;
  },
  deletePostById: async (id: string): Promise<boolean> => {
    const { deletedCount } = await postCollection.deleteOne({ _id: new Object(id) });

    return deletedCount === 1 ? true : false;
  },
};
