export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export type AuthConfig = {
  accessSecret: string;
  refreshExpires: string;
  accessExpires: string;
  refreshSecret: string;
  resetPassword: {
    secret: string;
    expires: string;
  };
};

export type AppConfig = {
  port: number;
  env: Environment;
};

export type DatabaseConfig = {
  host: string;
  name: string;
  username: string;
  password: string;
  port: number;
  type: string;
  synchronize: boolean;
  runMigration: boolean;
};

export type RedisConfig = {
  host: string;
  port: number;
  password?: string;
};

export type AllConfigType = {
  database: DatabaseConfig;
  app: AppConfig;
  auth: AuthConfig;
  redis: RedisConfig;
};
