import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Document } from './documents.entity';
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
    @InjectRepository(Document)
    private readonly document_repo: Repository<Document>,
    private readonly jwtService: JwtService,
    private readonly logger: CustomLogger,
  ) {}

  async signup(correlation_id: string, create_user_dto: CreateUserDto) {
    this.logger.setContext(this.constructor.name + '/signup');
    this.logger.debug(correlation_id, 'Starting user signup process');

    this.logger.debug(
      correlation_id,
      'Checking if user already exists in database',
    );
    const existing_user = await this.user_repo.findOne({
      where: { email: create_user_dto.email },
    });

    if (existing_user) {
      this.logger.debug(correlation_id, 'User already exists with this email');
      throw customHttpError(
        DATA_VALIDATION_ERROR,
        'EMAIL_EXISTS',
        'Email already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.logger.debug(correlation_id, 'Hashing user password');
    const hashed_password = await bcrypt.hash(create_user_dto.password, 10);

    this.logger.debug(correlation_id, 'Creating new user entity');
    const user = this.user_repo.create({
      ...create_user_dto,
      user_id: uuidv4(),
      password: hashed_password,
    });

    this.logger.debug(correlation_id, 'Saving user to database');
    const saved_user = await this.user_repo.save(user);
    this.logger.debug(
      correlation_id,
      `User saved successfully with ID: ${saved_user.user_id}`,
    );

    return {
      message: 'User registered successfully',
      data: {
        user_id: saved_user.user_id,
        first_name: saved_user.first_name,
        last_name: saved_user.last_name,
        email: saved_user.email,
        phone_number: saved_user.phone_number,
        is_admin: saved_user.is_admin,
        is_active: saved_user.is_active,
        created_at: saved_user.created_at,
      },
    };
  }

  async login(correlation_id: string, login_user_dto: LoginUserDto) {
    this.logger.setContext(this.constructor.name + '/login');
    this.logger.debug(correlation_id, 'Starting user login process');

    this.logger.debug(correlation_id, 'Finding user in database');
    const user = await this.user_repo.findOne({
      where: { email: login_user_dto.email },
    });

    if (!user) {
      this.logger.debug(correlation_id, 'User not found in database');
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'INVALID_CREDENTIALS',
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    this.logger.debug(correlation_id, 'Validating user password');
    const is_password_valid = await bcrypt.compare(
      login_user_dto.password,
      user.password,
    );

    if (!is_password_valid) {
      this.logger.debug(correlation_id, 'Invalid password provided');
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'INVALID_CREDENTIALS',
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!user.is_active || user.is_deleted) {
      this.logger.debug(correlation_id, 'User account is inactive or deleted');
      throw customHttpError(
        DATA_VALIDATION_ERROR,
        'ACCOUNT_INACTIVE',
        'Account is not active',
        HttpStatus.UNAUTHORIZED,
      );
    }

    this.logger.debug(correlation_id, 'Generating JWT token');
    const payload = {
      first_name: user.first_name,
      last_name: user.last_name,
      user_id: user.user_id,
      email: user.email,
      is_admin: user.is_admin,
    };
    const token = await this.jwtService.signAsync(payload);
    this.logger.debug(correlation_id, 'JWT token generated successfully');

    return {
      message: 'Login successful',
      data: {
        token,
        user: {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone_number: user.phone_number,
          is_admin: user.is_admin,
          is_active: user.is_active,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      },
    };
  }

  async findById(correlation_id: string, id: string) {
    this.logger.setContext(this.constructor.name + '/findById');
    this.logger.debug(correlation_id, `Finding user by ID: ${id}`);

    const user = await this.user_repo.findOne({ where: { user_id: id } });

    if (user) {
      this.logger.debug(correlation_id, `User found successfully: ${id}`);
      return {
        message: 'User found successfully',
        data: {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone_number: user.phone_number,
          is_admin: user.is_admin,
          is_active: user.is_active,
          is_deleted: user.is_deleted,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      };
    } else {
      this.logger.debug(correlation_id, `User not found: ${id}`);
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'USER_NOT_FOUND',
        'User not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async uploadDocument(
    correlation_id: string,
    user_id: string,
    document_path: string,
  ) {
    this.logger.setContext(this.constructor.name + '/uploadDocument');
    this.logger.debug(correlation_id, 'Starting document upload process');

    this.logger.debug(correlation_id, 'Creating new document entity');
    const document = this.document_repo.create({
      document_id: uuidv4(),
      user_id: user_id,
      document_path: document_path,
    });

    this.logger.debug(correlation_id, 'Saving document to database');
    const saved_document = await this.document_repo.save(document);
    this.logger.debug(
      correlation_id,
      `Document saved successfully with ID: ${saved_document.document_id}`,
    );

    return {
      message: 'Document uploaded successfully',
      data: {
        document_id: saved_document.document_id,
        user_id: saved_document.user_id,
        document_path: saved_document.document_path,
        uploaded_at: saved_document.uploaded_at,
        created_at: saved_document.created_at,
      },
    };
  }

  async getUserDocuments(correlation_id: string, user_id: string) {
    this.logger.setContext(this.constructor.name + '/getUserDocuments');
    this.logger.debug(
      correlation_id,
      `Fetching documents for user: ${user_id}`,
    );

    const documents = await this.document_repo.find({
      where: { user_id: user_id },
    });

    this.logger.debug(
      correlation_id,
      `Found ${documents.length} documents for user`,
    );

    return {
      message: 'Documents retrieved successfully',
      data: documents.map((doc) => ({
        document_id: doc.document_id,
        user_id: doc.user_id,
        document_path: doc.document_path,
        uploaded_at: doc.uploaded_at,
        created_at: doc.created_at,
      })),
    };
  }

  async updateUser(
    correlation_id: string,
    user_id: string,
    update_user_dto: any,
    current_user: any,
  ) {
    this.logger.setContext(this.constructor.name + '/updateUser');
    this.logger.debug(
      correlation_id,
      `Updating user ${user_id} by user ${current_user.user_id}`,
    );

    // Check if user exists
    const user = await this.user_repo.findOne({ where: { user_id: user_id } });
    if (!user) {
      this.logger.debug(correlation_id, `User not found: ${user_id}`);
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'USER_NOT_FOUND',
        'User not found',
        HttpStatus.NOT_FOUND,
      );
    }

    // Check if current user can update this user
    // Users can only update their own profile unless they are admin
    if (current_user.user_id !== user_id && !current_user.is_admin) {
      this.logger.debug(
        correlation_id,
        `User ${current_user.user_id} is not authorized to update user ${user_id}`,
      );
      throw customHttpError(
        DATA_VALIDATION_ERROR,
        'UNAUTHORIZED_UPDATE',
        'You can only update your own profile',
        HttpStatus.FORBIDDEN,
      );
    }

    // If updating password, hash it
    if (update_user_dto.password) {
      this.logger.debug(correlation_id, 'Hashing new password');
      update_user_dto.password = await bcrypt.hash(
        update_user_dto.password,
        10,
      );
    }

    // If updating email, check if it's already taken by another user
    if (update_user_dto.email && update_user_dto.email !== user.email) {
      const existing_user = await this.user_repo.findOne({
        where: { email: update_user_dto.email },
      });
      if (existing_user && existing_user.user_id !== user_id) {
        this.logger.debug(
          correlation_id,
          'Email already exists for another user',
        );
        throw customHttpError(
          DATA_VALIDATION_ERROR,
          'EMAIL_EXISTS',
          'Email already registered',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    // Non-admin users cannot change admin status or active status
    if (!current_user.is_admin) {
      delete update_user_dto.is_admin;
      delete update_user_dto.is_active;
    }

    this.logger.debug(correlation_id, 'Updating user in database');
    await this.user_repo.update(user_id, update_user_dto);

    // Fetch updated user
    const updated_user = await this.user_repo.findOne({
      where: { user_id: user_id },
    });
    if (!updated_user) {
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'USER_NOT_FOUND',
        'User not found',
        HttpStatus.NOT_FOUND,
      );
    }

    this.logger.debug(correlation_id, `User ${user_id} updated successfully`);

    return {
      message: 'User updated successfully',
      data: {
        user_id: updated_user.user_id,
        first_name: updated_user.first_name,
        last_name: updated_user.last_name,
        email: updated_user.email,
        phone_number: updated_user.phone_number,
        is_admin: updated_user.is_admin,
        is_active: updated_user.is_active,
        updated_at: updated_user.updated_at,
      },
    };
  }

  async deleteUser(correlation_id: string, user_id: string, current_user: any) {
    this.logger.setContext(this.constructor.name + '/deleteUser');
    this.logger.debug(
      correlation_id,
      `Deleting user ${user_id} by user ${current_user.user_id}`,
    );

    // Only admins can delete users
    if (!current_user.is_admin) {
      this.logger.debug(
        correlation_id,
        `User ${current_user.user_id} is not authorized to delete users`,
      );
      throw customHttpError(
        DATA_VALIDATION_ERROR,
        'UNAUTHORIZED_DELETE',
        'Only admins can delete users',
        HttpStatus.FORBIDDEN,
      );
    }

    // Check if user exists
    const user = await this.user_repo.findOne({ where: { user_id: user_id } });
    if (!user) {
      this.logger.debug(correlation_id, `User not found: ${user_id}`);
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'USER_NOT_FOUND',
        'User not found',
        HttpStatus.NOT_FOUND,
      );
    }

    // Soft delete the user
    this.logger.debug(correlation_id, 'Soft deleting user');
    await this.user_repo.update(user_id, {
      is_deleted: true,
      is_active: false,
    });

    this.logger.debug(correlation_id, `User ${user_id} deleted successfully`);

    return {
      message: 'User deleted successfully',
      data: { user_id },
    };
  }
}
