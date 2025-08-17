import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CustomLogger } from 'src/core/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly logger: CustomLogger,
  ) {}

  async signup(correlation_id: string, create_user_dto: CreateUserDto) {
    this.logger.setContext(this.constructor.name + '/signup');
    this.logger.verbose(correlation_id, 'Start');

    this.logger.debug(correlation_id, 'Going to Find User in the DB');
    const existingUser = await this.userRepo.findOne({
      where: { email: create_user_dto.email },
    });
    if (existingUser) throw new BadRequestException('Email already registered');

    const hashedPassword = await bcrypt.hash(create_user_dto.password, 10);

    const user = this.userRepo.create({
      ...create_user_dto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepo.save(user);

    return {
      message: 'User registered successfully',
      user: { id: savedUser.id, name: savedUser.name, email: savedUser.email },
    };
  }

  async login(correlation_id: string, login_user_dto: LoginUserDto) {
    const user = await this.userRepo.findOne({
      where: { email: login_user_dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(
      login_user_dto.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    if (!user.is_active || user.is_deleted || user.is_blocked) {
      throw new UnauthorizedException('Account is not active');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      is_admin: user.is_admin,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      token,
    };
  }

  async findById(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }
}
