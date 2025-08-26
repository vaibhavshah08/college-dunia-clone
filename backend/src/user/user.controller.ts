import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Correlation } from 'src/core/correlation/correlation.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly user_service: UserService) {}

  @Post('signup')
  async signup(
    @Correlation() correlation_id: string,
    @Body() create_user_dto: CreateUserDto,
  ) {
    return await this.user_service.signup(correlation_id, create_user_dto);
  }

  @Post('login')
  async login(
    @Correlation() correlation_id: string,
    @Body() login_user_dto: LoginUserDto,
  ) {
    return await this.user_service.login(correlation_id, login_user_dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@GetUser() user: any) {
    return user;
  }
}
