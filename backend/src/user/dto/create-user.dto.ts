import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidPassword } from 'src/common/decorators/validate-password.decorator';

export class CreateUserDto {
  @ApiProperty({
    description: "User's first name",
    example: 'John',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  readonly first_name: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  readonly last_name: string;

  @ApiProperty({
    description: "User's email address",
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: "User's password",
    example: 'SecurePass123!',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  // @IsValidPassword()
  readonly password: string;

  @ApiProperty({
    description: "User's phone number (optional)",
    example: '+91-9876543210',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly phone_number?: string;
}
