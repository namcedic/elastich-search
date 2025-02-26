import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { AppConfig, Environment } from './config.type';
import { registerAs } from '@nestjs/config';
import validateConfig from '../common/utils/validate-config';
import * as process from 'process';

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    env: (process.env.NODE_ENV as Environment) || Environment.Development,
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 3000,
  };
});
