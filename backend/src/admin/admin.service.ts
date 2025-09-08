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
} from 'src/core/custom-error/error-constant';

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
}
