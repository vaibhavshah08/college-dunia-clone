import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { College } from '../colleges/colleges.entity';
import { LoanApplication } from '../loans/loan.entity';
import { Review } from '../reviews/review.entity';
import { Document } from '../user/documents.entity';
import { CustomLogger } from 'src/core/logger/logger.service';
import { customHttpError } from 'src/core/custom-error/error-service';
import {
  ENTITY_FETCH_ERROR,
  ENTITY_CREATE_ERROR,
  ENTITY_UPDATE_ERROR,
  ENTITY_NOT_FOUND,
  DATA_VALIDATION_ERROR,
} from 'src/core/custom-error/error-constant';
import * as bcrypt from 'bcrypt';
import { AdminCreateUserDto } from '../user/dto/admin-create-user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(College)
    private readonly collegeRepo: Repository<College>,
    @InjectRepository(LoanApplication)
    private readonly loanRepo: Repository<LoanApplication>,
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Document)
    private readonly documentRepo: Repository<Document>,
    private readonly logger: CustomLogger,
  ) {}

  async getDashboardStats(correlation_id: string) {
    this.logger.setContext(this.constructor.name + '/getDashboardStats');
    this.logger.debug(correlation_id, 'Fetching admin dashboard statistics');

    try {
      const [
        totalUsers,
        totalColleges,
        totalLoans,
        totalDocuments,
        pendingLoans,
      ] = await Promise.all([
        this.userRepo.count(),
        this.collegeRepo.count(),
        this.loanRepo.count(),
        this.documentRepo.count(),
        this.loanRepo.count({ where: { status: 'submitted' } }),
      ]);

      const stats = {
        totalUsers,
        totalColleges,
        totalLoans,
        totalDocuments,
        pendingLoans,
        partneredColleges: await this.collegeRepo.count({
          where: { is_partnered: true },
        }),
      };

      this.logger.debug(
        correlation_id,
        'Dashboard stats retrieved successfully',
        stats,
      );
      return {
        message: 'Dashboard statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      this.logger.error(
        correlation_id,
        'Error fetching dashboard stats',
        error,
      );
      throw customHttpError(
        ENTITY_FETCH_ERROR,
        'Dashboard Stats Fetch Error',
        'Failed to fetch dashboard statistics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(
    correlation_id: string,
    create_user_dto: AdminCreateUserDto,
    current_user: any,
  ) {
    this.logger.setContext(this.constructor.name + '/createUser');
    this.logger.debug(
      correlation_id,
      `Admin ${current_user.user_id} creating new user`,
    );

    try {
      // Check if user already exists
      const existing_user = await this.userRepo.findOne({
        where: { email: create_user_dto.email },
      });

      if (existing_user) {
        this.logger.debug(
          correlation_id,
          'User already exists with this email',
        );
        throw customHttpError(
          DATA_VALIDATION_ERROR,
          'EMAIL_EXISTS',
          'Email already registered',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Hash password
      this.logger.debug(correlation_id, 'Hashing user password');
      const hashed_password = await bcrypt.hash(create_user_dto.password, 10);

      // Create user entity
      this.logger.debug(correlation_id, 'Creating new user entity');
      const user = this.userRepo.create({
        ...create_user_dto,
        user_id: uuidv4().replace(/-/g, ''),
        password: hashed_password,
        is_admin: create_user_dto.is_admin || false,
        is_active:
          create_user_dto.is_active !== undefined
            ? create_user_dto.is_active
            : true,
      });

      // Save user
      this.logger.debug(correlation_id, 'Saving user to database');
      const saved_user = await this.userRepo.save(user);
      this.logger.debug(
        correlation_id,
        `User created successfully with ID: ${saved_user.user_id}`,
      );

      return {
        message: 'User created successfully',
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
    } catch (error) {
      this.logger.error(correlation_id, 'Error creating user', error);
      if (error.status) {
        throw error; // Re-throw custom HTTP errors
      }
      throw customHttpError(
        ENTITY_CREATE_ERROR,
        'User Creation Error',
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUsers(
    correlation_id: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    this.logger.setContext(this.constructor.name + '/getAllUsers');
    this.logger.debug(correlation_id, 'Fetching all users with pagination');

    try {
      const queryBuilder = this.userRepo.createQueryBuilder('user');

      if (search) {
        queryBuilder.where(
          'user.name LIKE :search OR user.email LIKE :search',
          { search: `%${search}%` },
        );
      }

      const [users, total] = await queryBuilder
        .orderBy('user.created_at', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        message: 'Users retrieved successfully',
        data: {
          users,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      this.logger.error(correlation_id, 'Error fetching users', error);
      throw customHttpError(
        ENTITY_FETCH_ERROR,
        'Users Fetch Error',
        'Failed to fetch users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllDocuments(
    correlation_id: string,
    page: number = 1,
    limit: number = 10,
    status?: string,
  ) {
    this.logger.setContext(this.constructor.name + '/getAllDocuments');
    this.logger.debug(correlation_id, 'Fetching all documents with pagination');

    try {
      const queryBuilder = this.documentRepo
        .createQueryBuilder('document')
        .leftJoinAndSelect('document.user', 'user');

      if (status) {
        queryBuilder.where('document.status = :status', { status });
      }

      const [documents, total] = await queryBuilder
        .orderBy('document.uploaded_at', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        message: 'Documents retrieved successfully',
        data: {
          documents,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      this.logger.error(correlation_id, 'Error fetching documents', error);
      throw customHttpError(
        ENTITY_FETCH_ERROR,
        'Documents Fetch Error',
        'Failed to fetch documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateDocumentStatus(
    correlation_id: string,
    documentId: string,
    status: string,
  ) {
    this.logger.setContext(this.constructor.name + '/updateDocumentStatus');
    this.logger.debug(
      correlation_id,
      `Updating document ${documentId} status to ${status}`,
    );

    try {
      const document = await this.documentRepo.findOne({
        where: { document_id: documentId },
      });
      if (!document) {
        throw customHttpError(
          ENTITY_NOT_FOUND,
          'Document Not Found',
          'Document not found',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.documentRepo.update(documentId, { status: status as any });

      this.logger.debug(
        correlation_id,
        `Document ${documentId} status updated to ${status}`,
      );
      return {
        message: 'Document status updated successfully',
        data: { documentId, status },
      };
    } catch (error) {
      this.logger.error(
        correlation_id,
        'Error updating document status',
        error,
      );
      throw customHttpError(
        ENTITY_UPDATE_ERROR,
        'Document Status Update Error',
        'Failed to update document status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
      `Admin ${current_user.user_id} updating user ${user_id}`,
    );

    // Check if user exists
    const user = await this.userRepo.findOne({ where: { user_id: user_id } });
    if (!user) {
      this.logger.debug(correlation_id, `User not found: ${user_id}`);
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'USER_NOT_FOUND',
        'User not found',
        HttpStatus.NOT_FOUND,
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
      const existing_user = await this.userRepo.findOne({
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

    this.logger.debug(correlation_id, 'Updating user in database');
    await this.userRepo.update(user_id, update_user_dto);

    // Fetch updated user
    const updated_user = await this.userRepo.findOne({
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

    this.logger.debug(
      correlation_id,
      `User ${user_id} updated successfully by admin`,
    );

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
      `Admin ${current_user.user_id} deleting user ${user_id}`,
    );

    // Check if user exists
    const user = await this.userRepo.findOne({ where: { user_id: user_id } });
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
    await this.userRepo.update(user_id, {
      is_deleted: true,
      is_active: false,
    });

    this.logger.debug(
      correlation_id,
      `User ${user_id} deleted successfully by admin`,
    );

    return {
      message: 'User deleted successfully',
      data: { user_id },
    };
  }
}
