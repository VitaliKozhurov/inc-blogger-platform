declare namespace NodeJS {
  export interface ProcessEnv {
    AUTH_TOKEN: string;
    PORT: string;
    MONGO_URL: string;
    DB_NAME: string;
  }
}
