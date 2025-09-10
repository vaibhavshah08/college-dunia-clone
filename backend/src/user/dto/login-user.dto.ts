import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidPassword } from 'src/common/decorators/validate-password.decorator';

export class LoginUserDto {
  @ApiProperty({
    description: "User's email address",
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
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
}
