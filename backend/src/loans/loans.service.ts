import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanApplication, LoanStatus } from './loan.entity';
import { customHttpError } from 'src/core/custom-error/error-service';
import { ENTITY_NOT_FOUND } from 'src/core/custom-error/error-constant';
import { CustomLogger } from 'src/core/logger/logger.service';

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
    this.logger.verbose(
      correlation_id,
      `Submitting loan application for user ${user_id}`,
    );
    const entity = this.repo.create({
      ...data,
      user_id,
      status: 'submitted',
    });
    this.logger.log(
      correlation_id,
      `Loan application created: ${JSON.stringify(entity)}`,
    );
    const savedEntity = await this.repo.save(entity);
    this.logger.log(
      correlation_id,
      `Loan application saved successfully: ${savedEntity.id}`,
    );
    return savedEntity;
  }

  async listMine(correlation_id: string, user_id: string) {
    this.logger.setContext(this.constructor.name);
    this.logger.log(correlation_id, `Listing loans for user ${user_id}`);
    const results = await this.repo.find({ where: { user_id } });
    this.logger.log(
      correlation_id,
      `Found ${results.length} loans for user ${user_id}`,
    );
    return results;
  }

  async adminList(correlation_id: string) {
    this.logger.setContext(this.constructor.name);
    this.logger.log(correlation_id, `Listing all loans`);
    const results = await this.repo.find();
    this.logger.log(correlation_id, `Found ${results.length} total loans`);
    return results;
  }

  async updateStatus(correlation_id: string, id: string, status: LoanStatus) {
    this.logger.setContext(this.constructor.name);
    this.logger.log(
      correlation_id,
      `Updating loan status for ${id} to ${status}`,
    );
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      this.logger.error(correlation_id, `Loan not found for ${id}`);
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'LOAN_NOT_FOUND',
        'Loan not found',
        HttpStatus.NOT_FOUND,
      );
    }
    existing.status = status;
    const savedEntity = await this.repo.save(existing);
    this.logger.log(
      correlation_id,
      `Loan status updated successfully: ${id} -> ${status}`,
    );
    return savedEntity;
  }
}
