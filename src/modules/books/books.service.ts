import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookEntity } from '../../database/entities/book.entity';
import { SearchBookDto } from './dto/search-book.dto';
import { ElasticSearchService } from '../elastic-search/elastic-search.service';
import { BOOKS } from '../../common/constants';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    private readonly elasticSearchService: ElasticSearchService,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<BookEntity> {
    const book = await this.bookRepository.save(createBookDto);

    await this.elasticSearchService.getClient().index({
      index: BOOKS,
      document: book,
    });

    return book;
  }

  async findAll(): Promise<BookEntity[]> {
    return await this.bookRepository.find();
  }

  async findOne(id: number): Promise<BookEntity> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<BookEntity> {
    const book = await this.bookRepository.preload({
      id,
      ...updateBookDto,
    });

    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    const updateBook = await this.bookRepository.save(book);

    const elasticSearchResult = await this.elasticSearchService.getItem(
      BOOKS,
      id.toString(),
    );

    if (!elasticSearchResult || !elasticSearchResult.hits.hits.length) {
      await this.elasticSearchService.getClient().index({
        index: BOOKS,
        document: updateBook,
      });

      return updateBook;
    }

    await this.elasticSearchService.getClient().update({
      index: BOOKS,
      id: elasticSearchResult.hits.hits[0]._id,
      doc: {
        ...updateBook,
      },
    });

    return updateBook;
  }

  async remove(id: number): Promise<BookEntity> {
    const book = await this.findOne(id);
    const result = await this.bookRepository.remove(book);

    const elasticSearchResult = await this.elasticSearchService.getItem(
      BOOKS,
      id.toString(),
    );

    if (!elasticSearchResult?.hits?.hits) {
      return result;
    }

    await this.elasticSearchService.getClient().delete({
      index: BOOKS,
      id: elasticSearchResult.hits.hits[0]._id,
    });

    return result;
  }

  async search(input: SearchBookDto) {
    const result = await this.elasticSearchService.getClient().search({
      index: BOOKS,
      query: {
        multi_match: {
          query: input.keyword,
          fields: ['title^3', 'description', 'name^2'],
        },
      },
    });

    return result?.hits?.hits;
  }
}
