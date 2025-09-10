import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanApplication } from './loan.entity';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { LoggerModule } from 'src/core/logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([LoanApplication]), LoggerModule],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}
