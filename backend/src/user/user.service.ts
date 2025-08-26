import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CustomLogger } from 'src/core/logger/logger.service';
import { customHttpError } from 'src/core/custom-error/error-service';
import {
  DATA_VALIDATION_ERROR,
  ENTITY_NOT_FOUND,
} from 'src/core/custom-error/error-constant';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user_repo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly logger: CustomLogger,
  ) {}

  async signup(correlation_id: string, create_user_dto: CreateUserDto) {
    this.logger.setContext(this.constructor.name + '/signup');
    this.logger.verbose(correlation_id, 'Start');

    this.logger.debug(correlation_id, 'Going to Find User in the DB');

    const existing_user = await this.user_repo.findOne({
      where: { email: create_user_dto.email },
    });

    if (existing_user)
      throw customHttpError(
        DATA_VALIDATION_ERROR,
        'EMAIL_EXISTS',
        'Email already registered',
        HttpStatus.BAD_REQUEST,
      );

    const hashed_password = await bcrypt.hash(create_user_dto.password, 10);

    const user = this.user_repo.create({
      ...create_user_dto,
      user_id: uuidv4(),
      password: hashed_password,
    });

    const saved_user = await this.user_repo.save(user);

    return {
      message: 'User registered successfully',
      user: {
        id: saved_user.user_id,
        name: saved_user.name,
        email: saved_user.email,
      },
    };
  }

  async login(correlation_id: string, login_user_dto: LoginUserDto) {
    this.logger.setContext(this.constructor.name + '/login');
    this.logger.verbose(correlation_id, 'Start');

    const user = await this.user_repo.findOne({
      where: { email: login_user_dto.email },
    });
    if (!user)
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'INVALID_CREDENTIALS',
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );

    const is_password_valid = await bcrypt.compare(
      login_user_dto.password,
      user.password,
    );
    if (!is_password_valid)
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'INVALID_CREDENTIALS',
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );

    if (!user.is_active || user.is_deleted || user.is_blocked)
      throw customHttpError(
        DATA_VALIDATION_ERROR,
        'ACCOUNT_INACTIVE',
        'Account is not active',
        HttpStatus.UNAUTHORIZED,
      );

    const payload = {
      name: user.name,
      sub: user.user_id,
      email: user.email,
      is_admin: user.is_admin,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      token,
    };
  }

  async findById(correlation_id: string, id: string) {
    this.logger.setContext(this.constructor.name + '/findById');
    this.logger.log(correlation_id, `Finding user by ID: ${id}`);
    const user = await this.user_repo.findOne({ where: { user_id: id } });
    if (user) {
      this.logger.log(correlation_id, `User found: ${id}`);
    } else {
      this.logger.warn(correlation_id, `User not found: ${id}`);
    }
    return user;
  }
}
