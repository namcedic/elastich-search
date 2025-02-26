import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
    @IsEmail({}, { message: 'Email is not valid' })
    email: string;

    @IsNotEmpty({ message: 'first name is not empty' })
    @IsString({ message: 'first name is invalid' })
    firstName: string;

    @IsNotEmpty({ message: 'last name is not empty' })
    @IsString({ message: 'last name is invalid' })
    lastName: string;

    @IsOptional()
    @IsString({ message: 'address is not empty' })
    address?: string;
}
