import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SearchBookDto {
    @IsOptional({ message: 'Name must not be empty' })
    @IsString({ message: 'Name must be a string' })
    keyword: string;

}
