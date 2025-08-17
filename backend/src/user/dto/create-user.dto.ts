import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  course?: string;

  @IsOptional()
  phone_number?: string;

  @IsOptional()
  city?: string;
}
