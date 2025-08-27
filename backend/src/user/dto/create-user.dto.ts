import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsValidPassword } from 'src/common/decorators/validate-password.decorator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  // @IsValidPassword()
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly course?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly phone_number?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly city?: string;
}
