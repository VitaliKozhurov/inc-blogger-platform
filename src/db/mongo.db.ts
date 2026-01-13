import { Collection, Db, MongoClient } from 'mongodb';

import { COLLECTION_NAME } from './constants';

import { BlogEntityType } from '@/blogs/types/blog';
import { SETTINGS } from '@/core/settings';
import { PostEntityType } from '@/posts/types/post';

let client: MongoClient;

export let blogCollection: Collection<BlogEntityType>;
export let postCollection: Collection<PostEntityType>;

export const runDB = async (dbUrl: string) => {
  client = new MongoClient(dbUrl);

  const db: Db = client.db(SETTINGS.DB_NAME);

  blogCollection = db.collection<BlogEntityType>(COLLECTION_NAME.BLOGS);
  postCollection = db.collection<PostEntityType>(COLLECTION_NAME.POSTS);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('✅ Connected to DB');
  } catch (e) {
    await client.close();

    throw new Error(`❌ Database not connected: ${e}`);
  }
};

export const stopDb = async () => {
  if (!client) {
    throw new Error(`❌ No active client`);
  }

  await client.close();
};
