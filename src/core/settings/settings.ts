import dotenv from 'dotenv';

dotenv.config();

export const SETTINGS = {
  AUTH_TOKEN: process.env.AUTH_TOKEN,
  PORT: process.env.PORT || 5000,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/back-blogger-platform',
  DB_NAME: process.env.DB_NAME || 'back-blogger-platform',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_TIME: process.env.JWT_ACCESS_TIME,
  APP_EMAIL_ADDRESS: process.env.APP_EMAIL_ADDRESS ?? '',
  APP_EMAIL_PASSWORD: process.env.APP_EMAIL_PASSWORD,
};
