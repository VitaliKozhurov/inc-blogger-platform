import { Collection, Db, MongoClient } from 'mongodb';

import { BlogEntityType } from '../blogs/types';
import { SETTINGS } from '../core/settings';
import { PostEntityType } from '../posts/types';
import { UserDBType } from '../users/types';

import { COLLECTION_NAME } from './constants';

let client: MongoClient;

export let blogCollection: Collection<BlogEntityType>;
export let postCollection: Collection<PostEntityType>;
export let userCollection: Collection<UserDBType>;

export const runDB = async (dbUrl: string) => {
  try {
    client = new MongoClient(dbUrl);

    const db: Db = client.db(SETTINGS.DB_NAME);

    blogCollection = db.collection<BlogEntityType>(COLLECTION_NAME.BLOGS);
    postCollection = db.collection<PostEntityType>(COLLECTION_NAME.POSTS);
    userCollection = db.collection<UserDBType>(COLLECTION_NAME.USERS);

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
