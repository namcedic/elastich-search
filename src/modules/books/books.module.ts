import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {BookEntity} from "../../database/entities/book.entity";
import {BooksController} from "./books.controller";
import {BooksService} from "./books.service";
import {ElasticSearchModule} from "../elastic-search/elastic-search.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity]),
    ElasticSearchModule
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
