import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidPassword } from 'src/common/decorators/validate-password.decorator';

export class AdminUpdateUserDto {
  @ApiProperty({
    description: "User's first name",
    example: 'John',
    minLength: 1,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly first_name?: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
    minLength: 1,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly last_name?: string;

  @ApiProperty({
    description: "User's email address",
    example: 'john.doe@example.com',
    format: 'email',
    required: false,
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly email?: string;

  @ApiProperty({
    description: "User's password",
    example: 'SecurePass123!',
    minLength: 6,
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  // @IsValidPassword()
  readonly password?: string;

  @ApiProperty({
    description: "User's phone number (optional)",
    example: '+91-9876543210',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly phone_number?: string;

  @ApiProperty({
    description: 'Whether user is an admin',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  readonly is_admin?: boolean;

  @ApiProperty({
    description: 'Whether user account is active',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  readonly is_active?: boolean;
}
