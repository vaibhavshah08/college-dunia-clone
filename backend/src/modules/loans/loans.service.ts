import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  LoanApplication,
  LoanStatus,
} from './entities/loan-application.entity';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(LoanApplication)
    private loanRepository: Repository<LoanApplication>,
  ) {}

  async create(createLoanDto: any, userId: number): Promise<LoanApplication> {
    const loan = this.loanRepository.create({
      ...createLoanDto,
      userId,
    });
    return this.loanRepository.save(loan);
  }

  async findByUser(userId: number): Promise<LoanApplication[]> {
    return this.loanRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(query: any = {}): Promise<any> {
    const queryBuilder = this.loanRepository
      .createQueryBuilder('loan')
      .leftJoinAndSelect('loan.user', 'user');

    if (query.status) {
      queryBuilder.andWhere('loan.status = :status', { status: query.status });
    }

    const [loans, total] = await queryBuilder
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getManyAndCount();

    return {
      data: loans,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  }

  async findById(id: number): Promise<LoanApplication> {
    const loan = await this.loanRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!loan) {
      throw new NotFoundException('Loan application not found');
    }

    return loan;
  }

  async updateStatus(
    id: number,
    status: LoanStatus,
    adminNotes?: string,
    adminId?: number,
  ): Promise<LoanApplication> {
    const loan = await this.findById(id);
    loan.status = status;
    loan.adminNotes = adminNotes;
    loan.approvedBy = adminId;
    loan.approvedAt = new Date();
    return this.loanRepository.save(loan);
  }
}
