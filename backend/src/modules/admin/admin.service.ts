import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { College } from '../colleges/entities/college.entity';
import { LoanApplication } from '../loans/entities/loan-application.entity';
import { Document } from '../documents/entities/document.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(College)
    private collegeRepository: Repository<College>,
    @InjectRepository(LoanApplication)
    private loanRepository: Repository<LoanApplication>,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalColleges,
      totalLoanApplications,
      totalDocuments,
      pendingLoans,
      unverifiedDocuments,
    ] = await Promise.all([
      this.userRepository.count(),
      this.collegeRepository.count({ where: { isActive: true } }),
      this.loanRepository.count(),
      this.documentRepository.count(),
      this.loanRepository.count({ where: { status: 'pending' } }),
      this.documentRepository.count({ where: { isVerified: false } }),
    ]);

    return {
      totalUsers,
      totalColleges,
      totalLoanApplications,
      totalDocuments,
      pendingLoans,
      unverifiedDocuments,
    };
  }

  async getRecentActivity() {
    const [recentUsers, recentLoans, recentDocuments] = await Promise.all([
      this.userRepository.find({
        order: { createdAt: 'DESC' },
        take: 5,
        select: ['id', 'firstName', 'lastName', 'email', 'createdAt'],
      }),
      this.loanRepository.find({
        order: { createdAt: 'DESC' },
        take: 5,
        relations: ['user'],
      }),
      this.documentRepository.find({
        order: { createdAt: 'DESC' },
        take: 5,
        relations: ['user'],
      }),
    ]);

    return {
      recentUsers,
      recentLoans,
      recentDocuments,
    };
  }
}
