import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {SearchBookDto} from "./dto/search-book.dto";

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    return await this.booksService.create(createBookDto);
  }

  @Get('/search')
  async search(@Query() input: SearchBookDto,) {
    return await this.booksService.search(input);
  }

  @Get()
  async findAll() {
    return await this.booksService.findAll();
  }



  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.booksService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return await this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.booksService.remove(+id);
  }
}
