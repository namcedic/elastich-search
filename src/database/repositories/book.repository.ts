import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BookEntity } from '../entities/book.entity';

@Injectable()
export class BookRepository extends Repository<BookEntity> {
  constructor(
    @InjectRepository(BookEntity)
    repository: Repository<BookEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
