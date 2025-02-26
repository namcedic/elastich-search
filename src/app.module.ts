import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { envConfigs } from './configs';
import { typeOrmConfig } from './database/typeorm.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { UsersModule } from './modules/users/users.module';
import { BooksModule } from './modules/books/books.module';
import { ElasticSearchModule } from './modules/elastic-search/elastic-search.module';
@Module({
  imports: [
    HttpModule,
    BooksModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: envConfigs,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory() {
        return typeOrmConfig;
      },
      dataSourceFactory: async (options: DataSourceOptions) => {
        if (!options) {
          throw new Error('DataSourceOptions is required');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    UsersModule,
    ElasticSearchModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
