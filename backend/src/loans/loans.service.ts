import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanApplication, LoanStatus } from './loan.entity';
import { customHttpError } from 'src/core/custom-error/error-service';
import { ENTITY_NOT_FOUND } from 'src/core/custom-error/error-constant';
import { CustomLogger } from 'src/core/logger/logger.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(LoanApplication)
    private readonly repo: Repository<LoanApplication>,
    private readonly logger: CustomLogger,
  ) {}

  async submit(
    correlation_id: string,
    user_id: string,
    data: Partial<LoanApplication>,
  ) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(
      correlation_id,
      'Starting loan application submission process',
    );
    this.logger.debug(
      correlation_id,
      `Submitting loan application for user ${user_id}`,
    );

    this.logger.debug(correlation_id, 'Generating loan ID');
    const loan_id = uuidv4();

    this.logger.debug(correlation_id, 'Creating loan application entity');
    const entity = this.repo.create({
      ...data,
      loan_id: loan_id,
      user_id: user_id,
      status: 'submitted',
    });

    this.logger.debug(correlation_id, 'Saving loan application to database');
    const saved_entity = await this.repo.save(entity);
    this.logger.debug(
      correlation_id,
      `Loan application saved successfully: ${saved_entity.loan_id}`,
    );

    return {
      message: 'Loan application submitted successfully',
      data: {
        loan_id: saved_entity.loan_id,
        user_id: saved_entity.user_id,
        loan_type: saved_entity.loan_type,
        principal_amount: saved_entity.principal_amount,
        interest_rate: saved_entity.interest_rate,
        term_months: saved_entity.term_months,
        status: saved_entity.status,
        college_id: saved_entity.college_id,
        description: saved_entity.description,
        created_at: saved_entity.created_at,
      },
    };
  }

  async listMine(correlation_id: string, user_id: string) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(correlation_id, 'Starting loan listing process for user');
    this.logger.debug(correlation_id, `Listing loans for user ${user_id}`);

    this.logger.debug(correlation_id, 'Querying database for user loans');
    const results = await this.repo.find({ where: { user_id: user_id } });
    this.logger.debug(
      correlation_id,
      `Found ${results.length} loans for user ${user_id}`,
    );

    return {
      message: 'Loans retrieved successfully',
      data: results.map((loan) => ({
        loan_id: loan.loan_id,
        user_id: loan.user_id,
        loan_type: loan.loan_type,
        principal_amount: loan.principal_amount,
        interest_rate: loan.interest_rate,
        term_months: loan.term_months,
        status: loan.status,
        college_id: loan.college_id,
        description: loan.description,
        created_at: loan.created_at,
      })),
    };
  }

  async adminList(correlation_id: string) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(correlation_id, 'Starting admin loan listing process');

    this.logger.debug(correlation_id, 'Querying database for all loans');
    const results = await this.repo.find();
    this.logger.debug(correlation_id, `Found ${results.length} total loans`);

    return {
      message: 'All loans retrieved successfully',
      data: results.map((loan) => ({
        loan_id: loan.loan_id,
        user_id: loan.user_id,
        loan_type: loan.loan_type,
        principal_amount: loan.principal_amount,
        interest_rate: loan.interest_rate,
        term_months: loan.term_months,
        status: loan.status,
        college_id: loan.college_id,
        description: loan.description,
        created_at: loan.created_at,
      })),
    };
  }

  async updateStatus(correlation_id: string, id: string, status: LoanStatus) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(correlation_id, 'Starting loan status update process');
    this.logger.debug(
      correlation_id,
      `Updating loan status for ${id} to ${status}`,
    );

    this.logger.debug(correlation_id, 'Finding loan in database');
    const existing = await this.repo.findOne({ where: { loan_id: id } });
    if (!existing) {
      this.logger.debug(correlation_id, `Loan not found for ${id}`);
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'LOAN_NOT_FOUND',
        'Loan not found',
        HttpStatus.NOT_FOUND,
      );
    }

    this.logger.debug(correlation_id, 'Updating loan status');
    existing.status = status;

    this.logger.debug(correlation_id, 'Saving updated loan to database');
    const saved_entity = await this.repo.save(existing);
    this.logger.debug(
      correlation_id,
      `Loan status updated successfully: ${id} -> ${status}`,
    );

    return {
      message: 'Loan status updated successfully',
      data: {
        loan_id: saved_entity.loan_id,
        user_id: saved_entity.user_id,
        loan_type: saved_entity.loan_type,
        principal_amount: saved_entity.principal_amount,
        interest_rate: saved_entity.interest_rate,
        term_months: saved_entity.term_months,
        status: saved_entity.status,
        college_id: saved_entity.college_id,
        description: saved_entity.description,
        created_at: saved_entity.created_at,
      },
    };
  }

  async findById(correlation_id: string, id: string) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(correlation_id, 'Starting loan find by ID process');
    this.logger.debug(correlation_id, `Finding loan by ID: ${id}`);

    this.logger.debug(correlation_id, 'Querying database for loan');
    const existing = await this.repo.findOne({ where: { loan_id: id } });
    if (!existing) {
      this.logger.debug(correlation_id, `Loan not found: ${id}`);
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'LOAN_NOT_FOUND',
        'Loan not found',
        HttpStatus.NOT_FOUND,
      );
    }

    this.logger.debug(correlation_id, `Loan found successfully: ${id}`);
    return {
      message: 'Loan found successfully',
      data: {
        loan_id: existing.loan_id,
        user_id: existing.user_id,
        loan_type: existing.loan_type,
        principal_amount: existing.principal_amount,
        interest_rate: existing.interest_rate,
        term_months: existing.term_months,
        status: existing.status,
        college_id: existing.college_id,
        description: existing.description,
        created_at: existing.created_at,
      },
    };
  }
}
