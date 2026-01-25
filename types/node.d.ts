declare namespace NodeJS {
  export interface ProcessEnv {
    AUTH_TOKEN: string;
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_TIME: number;
    PORT: number;
    MONGO_URL: string;
    DB_NAME: string;
  }
}
