import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsValidPassword } from 'src/common/decorators/validate-password.decorator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  // @IsValidPassword()
  readonly password: string;
}
