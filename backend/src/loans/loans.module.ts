import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanApplication } from './loan.entity';
import { User } from '../user/entities/user.entity';
import { College } from '../colleges/colleges.entity';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { LoggerModule } from 'src/core/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoanApplication, User, College]),
    LoggerModule,
  ],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}
