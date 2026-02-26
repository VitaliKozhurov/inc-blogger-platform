declare namespace NodeJS {
  export interface ProcessEnv {
    AUTH_TOKEN: string;
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_TIME: number;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_TIME: number;
    PORT: number;
    MONGO_URL: string;
    DB_NAME: string;
    APP_EMAIL_ADDRESS: string;
    APP_EMAIL_PASSWORD: string;
  }
}
