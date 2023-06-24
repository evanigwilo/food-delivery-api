declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      SERVER_PORT: string;
      SERVER_HOST: string;
      API_VERSION: string;
      SESSION_ID: string;
      SESSION_SECRET: string;
      REDIS_DB_HOST: string;
      REDIS_DB_PORT: string;
      DATABASE_DIALECT: string;
      DATABASE_USER: string;
      DATABASE_PASSWORD: string;
      DATABASE_DB: string;
      DATABASE_HOST: string;
      DATABASE_PORT: string;
    }
  }
}

export {}
