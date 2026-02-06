import { Collection, Db, MongoClient } from 'mongodb';

import { RefreshTokenDBType } from '../auth/types';
import { BlogDBType } from '../blogs/types';
import { CommentDbType } from '../comments/types';
import { SETTINGS } from '../core/settings';
import { PostDBType } from '../posts/types';
import { UserDBType } from '../users/types';

import { COLLECTION_NAME } from './constants';

let client: MongoClient;

export let blogsCollection: Collection<BlogDBType>;
export let postsCollection: Collection<PostDBType>;
export let commentsCollection: Collection<CommentDbType>;
export let usersCollection: Collection<UserDBType>;
export let revokedRefreshTokenCollection: Collection<RefreshTokenDBType>;

export const runDB = async (dbUrl: string) => {
  try {
    client = new MongoClient(dbUrl);

    const db: Db = client.db(SETTINGS.DB_NAME);

    blogsCollection = db.collection<BlogDBType>(COLLECTION_NAME.BLOGS);
    postsCollection = db.collection<PostDBType>(COLLECTION_NAME.POSTS);
    commentsCollection = db.collection<CommentDbType>(COLLECTION_NAME.COMMENTS);
    usersCollection = db.collection<UserDBType>(COLLECTION_NAME.USERS);
    revokedRefreshTokenCollection = db.collection<RefreshTokenDBType>(
      COLLECTION_NAME.REVOKED_REFRESH_TOKENS
    );

    revokedRefreshTokenCollection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 });

    await client.connect();
    await db.command({ ping: 1 });
    console.log('✅ Connected to DB');

    return db;
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
