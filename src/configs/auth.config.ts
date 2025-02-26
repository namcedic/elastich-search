import { IsString } from 'class-validator';

import { AuthConfig } from './config.type';
import { registerAs } from '@nestjs/config';
import * as process from 'process';
import validateConfig from '../common/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  JWT_ACCESS_EXPIRES: string;

  @IsString()
  JWT_REFRESH_EXPIRES: string;

  @IsString()
  JWT_RESET_PASSWORD_SECRET: string;

  @IsString()
  JWT_RESET_PASSWORD_EXPIRES: string;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    accessSecret: process.env.JWT_SECRET,
    refreshExpires: process.env.JWT_REFRESH_EXPIRES,
    accessExpires: process.env.JWT_ACCESS_EXPIRES,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    resetPassword: {
      secret: process.env.JWT_RESET_PASSWORD_SECRET,
      expires: process.env.JWT_RESET_PASSWORD_EXPIRES,
    },
  };
});
