import mongoose from 'mongoose';

import { SETTINGS } from '../core/settings';

export const runDB = async (dbUrl: string) => {
  try {
    const mongooseDB = await mongoose.connect(`${dbUrl}/${SETTINGS.DB_NAME}`);

    console.log('✅ Connected to DB');

    return mongooseDB;
  } catch (e) {
    throw new Error(`❌ Database not connected: ${e}`);
  }
};

export const stopDb = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('❌ Close DB connection');
    }
  } catch (e) {
    console.error('❌ Error while closing DB connection', e);
  }
};
