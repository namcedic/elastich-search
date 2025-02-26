import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
    @IsNotEmpty({ message: 'Name must not be empty' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsNotEmpty({ message: 'Title must not be empty' })
    @IsString({ message: 'Title must be a string' })
    title: string;

    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description?: string;
}
