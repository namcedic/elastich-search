import {IsInt, IsNotEmpty, IsString, Max, Min} from 'class-validator';
import {DatabaseConfig, ElasticSearchConfig} from './config.type';
import { registerAs } from '@nestjs/config';
import validateConfig from '../common/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  ELASTICSEARCH_USERNAME: string;

  @IsNotEmpty()
  @IsString()
  ELASTICSEARCH_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  ELASTICSEARCH_HOST: string;

  @IsString()
  @IsNotEmpty()
  ELASTICSEARCH_PORT: string;
}

export default registerAs<ElasticSearchConfig>('elastic', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD,
    host: process.env.ELASTICSEARCH_HOST,
    port: process.env.ELASTICSEARCH_PORT,
  };
});
