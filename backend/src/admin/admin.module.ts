import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../user/entities/user.entity';
import { College } from '../colleges/colleges.entity';
import { LoanApplication } from '../loans/loan.entity';
import { Review } from '../reviews/review.entity';
import { Document } from '../user/documents.entity';
import { LoggerModule } from 'src/core/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      College,
      LoanApplication,
      Review,
      Document,
    ]),
    LoggerModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
