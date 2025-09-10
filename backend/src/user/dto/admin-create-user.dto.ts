import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminCreateUserDto {
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
  readonly password: string;

  @ApiProperty({
    description: "User's phone number (optional)",
    example: '+91-9876543210',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly phone_number?: string;

  @ApiProperty({
    description: 'Whether user is an admin',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly is_admin?: boolean;

  @ApiProperty({
    description: 'Whether user account is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly is_active?: boolean;
}
